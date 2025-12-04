#!/usr/bin/env node

/**
 * Lead Generation MCP Server
 * Provides lead generation tools using Apollo.io API
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { config } from 'dotenv';
import { ApolloClient } from './apollo-client.js';
import {
  searchLeadsSchema,
  searchLeads,
  type SearchLeadsInput,
} from './tools/search-leads.js';
import {
  enrichContactSchema,
  enrichContact,
  type EnrichContactInput,
} from './tools/enrich-contact.js';
import {
  bulkEnrichSchema,
  bulkEnrich,
  type BulkEnrichInput,
} from './tools/bulk-enrich.js';
import {
  scoreLeadSchema,
  scoreLeadTool,
  type ScoreLeadInput,
} from './tools/score-lead.js';
import {
  exportLeadsSchema,
  exportLeads,
  type ExportLeadsInput,
} from './tools/export-leads.js';

// Load environment variables
config();

const APOLLO_API_KEY = process.env.APOLLO_API_KEY;
if (!APOLLO_API_KEY) {
  throw new Error('APOLLO_API_KEY environment variable is required');
}

// Initialize Apollo client
const apolloClient = new ApolloClient(APOLLO_API_KEY);

// Create MCP server
const server = new Server(
  {
    name: 'lead-generation-apollo',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'search_leads',
        description: 'Search for potential leads using Apollo.io filters. Filter by job titles, seniority, location, company size, and more.',
        inputSchema: {
          type: 'object',
          properties: {
            person_titles: {
              type: 'array',
              items: { type: 'string' },
              description: 'Job titles to search for (e.g., ["CEO", "CTO", "VP of Engineering"])',
            },
            person_seniorities: {
              type: 'array',
              items: { type: 'string' },
              description: 'Seniority levels (e.g., ["senior", "director", "vp", "c_suite"])',
            },
            person_locations: {
              type: 'array',
              items: { type: 'string' },
              description: 'Geographic locations (e.g., ["United States", "New York, NY"])',
            },
            q_keywords: {
              type: 'string',
              description: 'Keywords to search in person profiles',
            },
            organization_num_employees_ranges: {
              type: 'array',
              items: { type: 'string' },
              description: 'Company size ranges (e.g., ["1,10", "11,50", "51,200"])',
            },
            organization_locations: {
              type: 'array',
              items: { type: 'string' },
              description: 'Company locations',
            },
            page: {
              type: 'number',
              description: 'Page number for pagination',
              default: 1,
            },
            per_page: {
              type: 'number',
              description: 'Results per page (max 100)',
              default: 25,
            },
          },
        },
      },
      {
        name: 'enrich_contact',
        description: 'Enrich a single contact with detailed information including email, phone, LinkedIn profile, and company data.',
        inputSchema: {
          type: 'object',
          properties: {
            first_name: { type: 'string', description: 'First name of the person' },
            last_name: { type: 'string', description: 'Last name of the person' },
            organization_name: { type: 'string', description: 'Company name' },
            domain: { type: 'string', description: 'Company domain (e.g., apollo.io)' },
            email: { type: 'string', description: 'Email address' },
            linkedin_url: { type: 'string', description: 'LinkedIn profile URL' },
            reveal_personal_emails: {
              type: 'boolean',
              description: 'Reveal personal email addresses',
              default: true,
            },
            reveal_phone_number: {
              type: 'boolean',
              description: 'Reveal phone numbers',
              default: true,
            },
          },
        },
      },
      {
        name: 'bulk_enrich_contacts',
        description: 'Enrich up to 10 contacts at once with detailed information. More efficient than individual enrichment.',
        inputSchema: {
          type: 'object',
          properties: {
            contacts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  first_name: { type: 'string' },
                  last_name: { type: 'string' },
                  organization_name: { type: 'string' },
                  domain: { type: 'string' },
                  email: { type: 'string' },
                  linkedin_url: { type: 'string' },
                },
              },
              description: 'Array of contacts to enrich (max 10)',
              maxItems: 10,
            },
            reveal_personal_emails: {
              type: 'boolean',
              default: true,
            },
            reveal_phone_number: {
              type: 'boolean',
              default: true,
            },
          },
          required: ['contacts'],
        },
      },
      {
        name: 'score_lead',
        description: 'Score a lead based on data quality and relevance. Returns a grade (A-F) and detailed scoring factors.',
        inputSchema: {
          type: 'object',
          properties: {
            person: {
              type: 'object',
              description: 'Person object to score',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                title: { type: 'string' },
                email: { type: 'string' },
                phone_numbers: { type: 'array' },
                linkedin_url: { type: 'string' },
              },
              required: ['id', 'name'],
            },
            target_titles: {
              type: 'array',
              items: { type: 'string' },
              description: 'Target job titles for relevance scoring',
            },
            target_seniorities: {
              type: 'array',
              items: { type: 'string' },
              description: 'Target seniority levels',
            },
          },
          required: ['person'],
        },
      },
      {
        name: 'export_leads',
        description: 'Export leads to CSV or JSON format. Saves the file to the current directory.',
        inputSchema: {
          type: 'object',
          properties: {
            leads: {
              type: 'array',
              description: 'Array of lead objects to export',
            },
            format: {
              type: 'string',
              enum: ['csv', 'json'],
              default: 'json',
              description: 'Export format',
            },
            filename: {
              type: 'string',
              description: 'Output filename (without extension)',
            },
            fields: {
              type: 'array',
              items: { type: 'string' },
              description: 'Fields to include in export (for CSV)',
            },
          },
          required: ['leads'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'search_leads': {
        const input = searchLeadsSchema.parse(args);
        return await searchLeads(apolloClient, input);
      }

      case 'enrich_contact': {
        const input = enrichContactSchema.parse(args);
        return await enrichContact(apolloClient, input);
      }

      case 'bulk_enrich_contacts': {
        const input = bulkEnrichSchema.parse(args);
        return await bulkEnrich(apolloClient, input);
      }

      case 'score_lead': {
        const input = scoreLeadSchema.parse(args);
        return await scoreLeadTool(input);
      }

      case 'export_leads': {
        const input = exportLeadsSchema.parse(args);
        return await exportLeads(input);
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: error.message,
            tool: name,
          }),
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Lead Generation MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
