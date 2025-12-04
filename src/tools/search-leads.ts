/**
 * Lead Search Tool
 * Search for potential leads using Apollo.io filters
 */

import { z } from 'zod';
import type { ApolloClient } from '../apollo-client.js';
import type { LeadSearchFilters } from '../types.js';

export const searchLeadsSchema = z.object({
  person_titles: z.array(z.string()).optional().describe('Job titles to search for (e.g., ["CEO", "CTO", "VP of Engineering"])'),
  person_seniorities: z.array(z.string()).optional().describe('Seniority levels (e.g., ["senior", "director", "vp", "c_suite"])'),
  person_locations: z.array(z.string()).optional().describe('Geographic locations (e.g., ["United States", "New York, NY"])'),
  q_keywords: z.string().optional().describe('Keywords to search in person profiles'),
  organization_num_employees_ranges: z.array(z.string()).optional().describe('Company size ranges (e.g., ["1,10", "11,50", "51,200"])'),
  organization_locations: z.array(z.string()).optional().describe('Company locations'),
  organization_industry_tag_ids: z.array(z.string()).optional().describe('Industry tags'),
  page: z.number().optional().default(1).describe('Page number for pagination'),
  per_page: z.number().optional().default(25).describe('Results per page (max 100)'),
});

export type SearchLeadsInput = z.infer<typeof searchLeadsSchema>;

export async function searchLeads(
  apolloClient: ApolloClient,
  input: SearchLeadsInput
) {
  const filters: LeadSearchFilters = {
    ...input,
  };

  const result = await apolloClient.searchPeople(filters);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          summary: {
            total_results: result.pagination.total_entries,
            current_page: result.pagination.page,
            total_pages: result.pagination.total_pages,
            results_on_page: result.people.length,
          },
          leads: result.people.map(person => ({
            id: person.id,
            name: person.name,
            title: person.title,
            email: person.email,
            phone: person.phone_numbers?.[0]?.sanitized_number,
            linkedin: person.linkedin_url,
            company: person.organization_name,
            location: [person.city, person.state, person.country].filter(Boolean).join(', '),
          })),
          pagination: result.pagination,
        }, null, 2),
      },
    ],
  };
}
