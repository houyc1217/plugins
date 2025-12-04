# Lead Generation Apollo MCP Plugin

A modular, production-ready lead generation plugin for Claude Code that leverages Apollo.io's powerful B2B database and LinkedIn data retrieval through netmind's Apollo MCP service.

## Features

### 🔍 Lead Search
- Search 275M+ contacts with 65+ filters
- Filter by job title, seniority, location, company size, industry
- Keyword search across profiles
- Paginated results for large datasets

### 📊 Contact Enrichment
- **Single enrichment**: Enrich one contact at a time
- **Bulk enrichment**: Enrich up to 10 contacts per API call
- Retrieve emails, phone numbers, LinkedIn profiles
- Get company information (size, industry, location)

### ⭐ Lead Scoring
- Automated lead quality scoring (A-F grade)
- Factors: email/phone availability, LinkedIn presence, data completeness
- Title relevance and seniority level analysis
- Customizable scoring based on target criteria

### 📤 Data Export
- Export to CSV or JSON format
- Customizable field selection
- Batch export for large lead lists
- Timestamp-based file naming

## Installation

1. Clone or download this plugin to your Claude Code plugins directory

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your API keys:
```env
APOLLO_API_KEY=your_apollo_api_key_here
NETMIND_API_TOKEN=your_netmind_api_token_here
NETMIND_APOLLO_ENDPOINT=https://www.netmind.ai/AIServices/apollo-io
```

4. Build the plugin:
```bash
npm run build
```

5. Add to Claude Code MCP configuration (`.mcp.json` or `~/.claude.json`):
```json
{
  "mcpServers": {
    "lead-generation-apollo": {
      "command": "node",
      "args": ["/path/to/plugins/dist/index.js"],
      "env": {
        "APOLLO_API_KEY": "your_key_here"
      }
    }
  }
}
```

## Usage Examples

### Search for Leads

Search for CTOs in New York:
```typescript
// Use the search_leads tool
{
  "person_titles": ["CTO", "Chief Technology Officer"],
  "person_locations": ["New York, NY"],
  "person_seniorities": ["c_suite"],
  "per_page": 25
}
```

Search for decision-makers in tech companies:
```typescript
{
  "person_titles": ["CEO", "CTO", "VP of Engineering"],
  "person_seniorities": ["c_suite", "vp", "director"],
  "organization_num_employees_ranges": ["51,200", "201,500"],
  "q_keywords": "artificial intelligence"
}
```

### Enrich a Contact

Enrich by email:
```typescript
{
  "email": "john.doe@company.com",
  "reveal_personal_emails": true,
  "reveal_phone_number": true
}
```

Enrich by LinkedIn:
```typescript
{
  "linkedin_url": "https://www.linkedin.com/in/johndoe",
  "reveal_personal_emails": true,
  "reveal_phone_number": true
}
```

### Bulk Enrich Contacts

Enrich multiple contacts at once:
```typescript
{
  "contacts": [
    {
      "first_name": "John",
      "last_name": "Doe",
      "organization_name": "Acme Corp"
    },
    {
      "email": "jane@company.com"
    },
    {
      "linkedin_url": "https://www.linkedin.com/in/bobsmith"
    }
  ],
  "reveal_personal_emails": true,
  "reveal_phone_number": true
}
```

### Score a Lead

Evaluate lead quality:
```typescript
{
  "person": {
    "id": "12345",
    "name": "John Doe",
    "title": "CTO",
    "email": "john@company.com",
    "phone_numbers": [{"sanitized_number": "+1234567890"}],
    "linkedin_url": "https://linkedin.com/in/johndoe"
  },
  "target_titles": ["CTO", "VP of Engineering"],
  "target_seniorities": ["c_suite", "vp"]
}
```

### Export Leads

Export to JSON:
```typescript
{
  "leads": [...], // Array of lead objects
  "format": "json",
  "filename": "tech-leads-2025"
}
```

Export to CSV:
```typescript
{
  "leads": [...],
  "format": "csv",
  "filename": "sales-leads",
  "fields": ["name", "email", "title", "company", "phone"]
}
```

## Tool Reference

### `search_leads`
Search for potential leads using filters.

**Parameters:**
- `person_titles`: string[] - Job titles
- `person_seniorities`: string[] - Seniority levels (senior, director, vp, c_suite)
- `person_locations`: string[] - Geographic locations
- `q_keywords`: string - Keywords to search
- `organization_num_employees_ranges`: string[] - Company size ranges
- `organization_locations`: string[] - Company locations
- `page`: number - Page number (default: 1)
- `per_page`: number - Results per page (default: 25, max: 100)

### `enrich_contact`
Enrich a single contact with detailed information.

**Parameters:**
- `first_name`: string
- `last_name`: string
- `organization_name`: string
- `domain`: string
- `email`: string
- `linkedin_url`: string
- `reveal_personal_emails`: boolean (default: true)
- `reveal_phone_number`: boolean (default: true)

### `bulk_enrich_contacts`
Enrich up to 10 contacts at once.

**Parameters:**
- `contacts`: array (max 10) - Array of contact objects
- `reveal_personal_emails`: boolean (default: true)
- `reveal_phone_number`: boolean (default: true)

### `score_lead`
Score a lead based on quality and relevance.

**Parameters:**
- `person`: object - Person object with id, name, title, email, etc.
- `target_titles`: string[] - Target job titles for relevance
- `target_seniorities`: string[] - Target seniority levels

**Returns:**
- `score`: 0-100 score
- `grade`: A, B, C, D, or F
- `factors`: Detailed scoring breakdown

### `export_leads`
Export leads to CSV or JSON.

**Parameters:**
- `leads`: array - Array of lead objects
- `format`: 'csv' | 'json'
- `filename`: string - Output filename (optional)
- `fields`: string[] - Fields to include (CSV only, optional)

## Best Practices

### Multi-Channel Outreach
Combine data from this plugin with email sequences and LinkedIn outreach for optimal results. Research shows multi-channel approaches can increase meeting bookings by 24%.

### Lead Scoring Workflow
1. Search for leads using filters
2. Enrich top matches to get full contact information
3. Score enriched leads to prioritize
4. Export A/B-grade leads for immediate outreach
5. Export C-grade leads for nurturing campaigns

### Data Quality
- Always use `reveal_personal_emails` and `reveal_phone_number` for better results
- Bulk enrichment is more efficient for large lists (10 contacts per call vs. 1)
- Score leads before reaching out to focus on highest-quality prospects

### API Credits
- Search operations don't consume credits
- Enrichment operations consume credits per contact
- Use bulk enrichment to optimize credit usage

## Architecture

```
lead-generation-apollo/
├── src/
│   ├── index.ts              # MCP server main entry
│   ├── apollo-client.ts      # Apollo.io API wrapper
│   ├── types.ts              # TypeScript type definitions
│   └── tools/
│       ├── search-leads.ts   # Lead search tool
│       ├── enrich-contact.ts # Single enrichment tool
│       ├── bulk-enrich.ts    # Bulk enrichment tool
│       ├── score-lead.ts     # Lead scoring tool
│       └── export-leads.ts   # Data export tool
├── .claude-plugin/
│   └── manifest.json         # Plugin metadata
└── package.json
```

## Technology Stack

- **MCP SDK**: @modelcontextprotocol/sdk ^1.0.4
- **Apollo.io API**: Official REST API
- **TypeScript**: Type-safe development
- **Zod**: Runtime type validation
- **Axios**: HTTP client

## Limitations

- Bulk enrichment: 10 contacts per request
- Search results: Max 100 per page
- API rate limits apply based on Apollo.io plan
- Requires valid Apollo.io API key

## Resources

### Apollo.io Documentation
- [People Search API](https://docs.apollo.io/reference/people-api-search)
- [People Enrichment](https://docs.apollo.io/reference/people-enrichment)
- [Bulk Enrichment](https://docs.apollo.io/reference/bulk-people-enrichment)

### Lead Generation Best Practices
- [Apollo Lead Generation Guide](https://www.apollo.io/magazine/lead-generation-best-practices-for-filling-your-sales-pipeline)
- [2025 Sales Automation Trends](https://scrupp.com/blog/apollo-lead-generation)

### Claude Code & MCP
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Claude Code Plugin Development](https://www.anthropic.com/news/claude-code-plugins)

## License

MIT

## Support

For issues and questions:
- Apollo.io API: [Apollo Knowledge Base](https://knowledge.apollo.io/hc/en-us/)
- Netmind API: Contact Netmind support
- Plugin issues: Create an issue in this repository
