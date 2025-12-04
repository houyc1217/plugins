/**
 * Contact Enrichment Tool
 * Enrich contact information for a single person
 */

import { z } from 'zod';
import type { ApolloClient } from '../apollo-client.js';

export const enrichContactSchema = z.object({
  first_name: z.string().optional().describe('First name of the person'),
  last_name: z.string().optional().describe('Last name of the person'),
  organization_name: z.string().optional().describe('Company name'),
  domain: z.string().optional().describe('Company domain (e.g., apollo.io)'),
  email: z.string().optional().describe('Email address'),
  linkedin_url: z.string().optional().describe('LinkedIn profile URL'),
  reveal_personal_emails: z.boolean().optional().default(true).describe('Reveal personal email addresses'),
  reveal_phone_number: z.boolean().optional().default(true).describe('Reveal phone numbers'),
});

export type EnrichContactInput = z.infer<typeof enrichContactSchema>;

export async function enrichContact(
  apolloClient: ApolloClient,
  input: EnrichContactInput
) {
  const result = await apolloClient.enrichPerson(input);

  if (!result.person) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            message: 'No matching person found',
          }, null, 2),
        },
      ],
    };
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          person: {
            id: result.person.id,
            name: result.person.name,
            first_name: result.person.first_name,
            last_name: result.person.last_name,
            title: result.person.title,
            email: result.person.email,
            email_status: result.person.email_status,
            phone_numbers: result.person.phone_numbers,
            linkedin_url: result.person.linkedin_url,
            location: {
              city: result.person.city,
              state: result.person.state,
              country: result.person.country,
            },
          },
          organization: result.organization ? {
            id: result.organization.id,
            name: result.organization.name,
            website: result.organization.website_url,
            linkedin: result.organization.linkedin_url,
            domain: result.organization.primary_domain,
            industry: result.organization.industry,
            employees: result.organization.estimated_num_employees,
            location: {
              city: result.organization.city,
              state: result.organization.state,
              country: result.organization.country,
            },
          } : null,
        }, null, 2),
      },
    ],
  };
}
