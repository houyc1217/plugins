/**
 * Bulk Contact Enrichment Tool
 * Enrich up to 10 contacts at once
 */

import { z } from 'zod';
import type { ApolloClient } from '../apollo-client.js';
import type { EnrichmentRequest } from '../types.js';

export const bulkEnrichSchema = z.object({
  contacts: z.array(z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    organization_name: z.string().optional(),
    domain: z.string().optional(),
    email: z.string().optional(),
    linkedin_url: z.string().optional(),
  })).max(10).describe('Array of contacts to enrich (max 10)'),
  reveal_personal_emails: z.boolean().optional().default(true),
  reveal_phone_number: z.boolean().optional().default(true),
});

export type BulkEnrichInput = z.infer<typeof bulkEnrichSchema>;

export async function bulkEnrich(
  apolloClient: ApolloClient,
  input: BulkEnrichInput
) {
  const requests: EnrichmentRequest[] = input.contacts.map(contact => ({
    ...contact,
    reveal_personal_emails: input.reveal_personal_emails,
    reveal_phone_number: input.reveal_phone_number,
  }));

  const results = await apolloClient.bulkEnrichPeople(requests);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          total_requested: input.contacts.length,
          total_enriched: results.filter(r => r.person).length,
          results: results.map(result => ({
            person: result.person ? {
              id: result.person.id,
              name: result.person.name,
              title: result.person.title,
              email: result.person.email,
              phone: result.person.phone_numbers?.[0]?.sanitized_number,
              linkedin: result.person.linkedin_url,
              company: result.person.organization_name,
            } : null,
            organization: result.organization ? {
              name: result.organization.name,
              website: result.organization.website_url,
              employees: result.organization.estimated_num_employees,
            } : null,
          })),
        }, null, 2),
      },
    ],
  };
}
