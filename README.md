# Lead Generation Apollo - Claude Code Plugin

<div align="center">

**🚀 Production-ready lead generation plugin for Claude Code**

Leverage Apollo.io's 275M+ contact database for LinkedIn and B2B prospecting

[![Claude Code](https://img.shields.io/badge/Claude-Code%20Plugin-7C3AED)](https://www.anthropic.com/claude)
[![MCP](https://img.shields.io/badge/MCP-Compatible-00A67E)](https://modelcontextprotocol.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6)](https://www.typescriptlang.org/)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation (MacOS)](#-installation-macos)
- [Configuration](#-configuration)
- [Usage](#-usage)
  - [Slash Commands](#slash-commands)
  - [MCP Tools](#mcp-tools)
  - [Complete Workflows](#complete-workflows)
- [API Reference](#-api-reference)
- [Best Practices](#-best-practices)
- [Troubleshooting](#-troubleshooting)
- [Architecture](#-architecture)
- [Resources](#-resources)

---

## ✨ Features

### 🔍 **Lead Search**
- Search **275M+ contacts** with **65+ filters**
- Filter by job title, seniority, location, company size, industry
- Keyword search across profiles
- Paginated results for large datasets

### 📊 **Contact Enrichment**
- **Single enrichment**: Enrich one contact at a time
- **Bulk enrichment**: Enrich up to 10 contacts per API call (10x faster!)
- Retrieve emails, phone numbers, LinkedIn profiles
- Get company information (size, industry, location)

### ⭐ **Lead Scoring**
- Automated lead quality scoring (0-100 with A-F grade)
- Factors: email/phone availability, LinkedIn presence, data completeness
- Title relevance and seniority level analysis
- Customizable scoring based on target criteria

### 📤 **Data Export**
- Export to **CSV** or **JSON** format
- Customizable field selection
- Batch export for large lead lists
- Timestamp-based file naming

### 🎯 **Complete Workflows**
- Integrated multi-step workflows
- Search → Enrich → Score → Export pipeline
- Slash commands for quick access
- MCP tools for programmatic use

---

## 📦 Prerequisites

Before installing, ensure you have:

1. **MacOS** (10.15 Catalina or later)
2. **Node.js** (v18 or later)
3. **npm** (comes with Node.js)
4. **Claude Code** (installed and configured)
5. **Apollo.io API Key** ([Get one here](https://apollo.io))

### Installing Node.js on MacOS

If you don't have Node.js installed:

```bash
# Using Homebrew (recommended)
brew install node

# Verify installation
node --version  # Should be v18 or later
npm --version
```

---

## 🚀 Installation (MacOS)

### Option 1: Automated Installation (Recommended)

1. **Clone or download this repository:**

```bash
cd ~/Documents  # or wherever you want to install
git clone <your-repo-url> lead-generation-apollo
cd lead-generation-apollo
```

2. **Run the installation script:**

```bash
./install.sh
```

The script will:
- ✅ Install npm dependencies
- ✅ Build the TypeScript project
- ✅ Create `.env` file if needed
- ✅ Guide you through MCP configuration
- ✅ Optionally install slash commands

3. **Configure your API key:**

Edit `.env` file:
```bash
nano .env
# or
open -e .env
```

Add your Apollo API key:
```env
APOLLO_API_KEY=your_apollo_api_key_here
NETMIND_API_TOKEN=your_netmind_token_here  # Optional
```

4. **Add MCP server to Claude Code:**

Edit `~/.claude/.mcp.json`:
```bash
nano ~/.claude/.mcp.json
# or
open -e ~/.claude/.mcp.json
```

Add this configuration:
```json
{
  "mcpServers": {
    "lead-generation-apollo": {
      "command": "node",
      "args": ["/full/path/to/lead-generation-apollo/dist/index.js"],
      "env": {
        "APOLLO_API_KEY": "your_apollo_api_key_here"
      }
    }
  }
}
```

**Important:** Replace `/full/path/to/lead-generation-apollo/` with the actual path. You can get it by running:
```bash
pwd  # While in the lead-generation-apollo directory
```

5. **Restart Claude Code**

### Option 2: Manual Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url> lead-generation-apollo
cd lead-generation-apollo
```

2. **Install dependencies:**
```bash
npm install
```

3. **Build the project:**
```bash
npm run build
```

4. **Configure environment:**
```bash
cp .env.example .env
nano .env  # Add your API keys
```

5. **Configure MCP server:**

Create or edit `~/.claude/.mcp.json`:
```json
{
  "mcpServers": {
    "lead-generation-apollo": {
      "command": "node",
      "args": ["/Users/yourname/path/to/lead-generation-apollo/dist/index.js"],
      "env": {
        "APOLLO_API_KEY": "your_key_here"
      }
    }
  }
}
```

6. **Install commands (optional):**
```bash
# Global installation (available everywhere)
cp -r .claude/commands/* ~/.claude/commands/

# Or local (project-specific)
# Commands in .claude/commands/ work automatically when in this directory
```

7. **Restart Claude Code**

---

## ⚙️ Configuration

### API Keys

You need an **Apollo.io API key**. Get one here:
1. Sign up at [apollo.io](https://apollo.io)
2. Go to Settings → API
3. Generate an API key
4. Add it to your `.env` file

### MCP Server Configuration

The plugin runs as an MCP server. Configuration location:
- **Global:** `~/.claude/.mcp.json` (available in all projects)
- **Project:** `./.mcp.json` (only in this project)

**Full configuration example:**
```json
{
  "mcpServers": {
    "lead-generation-apollo": {
      "command": "node",
      "args": ["/Users/john/lead-generation-apollo/dist/index.js"],
      "env": {
        "APOLLO_API_KEY": "your_apollo_key",
        "NETMIND_API_TOKEN": "your_netmind_token"
      }
    }
  }
}
```

### Slash Commands

Commands are markdown files in `.claude/commands/`. They can be:
- **Global:** `~/.claude/commands/` (available everywhere)
- **Local:** `./.claude/commands/` (project-specific)

Available commands:
- `/search-leads` - Search for leads
- `/enrich-contact` - Enrich contact data
- `/score-leads` - Score lead quality
- `/export-leads` - Export to CSV/JSON
- `/lead-workflow` - Complete workflow

---

## 💡 Usage

### Slash Commands

Slash commands provide an interactive, guided experience.

#### 1. Search for Leads

```
/search-leads
```

Claude will guide you through:
- Job titles to search for
- Seniority levels
- Geographic locations
- Company size
- Keywords

**Example conversation:**
```
You: /search-leads
Claude: I'll help you search for leads. What job titles are you targeting?
You: CTO, VP of Engineering
Claude: Great! What seniority levels? (c_suite, vp, director, senior, manager, entry)
You: c_suite, vp
Claude: Any geographic locations?
You: United States
Claude: Company size preferences? (e.g., "51,200" for 51-200 employees)
You: 51,200 and 201,500
Claude: Searching... [uses search_leads tool]
```

#### 2. Enrich Contacts

```
/enrich-contact
```

Provide contact information in any format:
- Email: `john@company.com`
- LinkedIn: `https://www.linkedin.com/in/johndoe`
- Name + Company: `John Doe at Acme Corp`

**For bulk enrichment (2-10 contacts):**
```
You: /enrich-contact
Claude: What contacts would you like to enrich?
You:
1. john@company.com
2. https://linkedin.com/in/jane
3. Bob Smith at Tech Corp
Claude: I'll enrich all 3 contacts using bulk enrichment... [uses bulk_enrich_contacts]
```

#### 3. Score Leads

```
/score-leads
```

Score leads after searching or enriching:
```
You: /score-leads
Claude: I'll score these leads. What are your target job titles?
You: CTO, VP of Engineering, Director of Engineering
Claude: Target seniority levels?
You: c_suite, vp, director
Claude: Scoring all leads... [uses score_lead for each]
```

#### 4. Export Leads

```
/export-leads
```

Export your leads:
```
You: /export-leads
Claude: I'll export these leads. CSV or JSON?
You: CSV
Claude: Which fields would you like? (or "all" for everything)
You: name, email, phone, title, company, linkedin, score
Claude: Filename?
You: tech-ctos-2025
Claude: Exporting... [uses export_leads tool]
```

#### 5. Complete Workflow

```
/lead-workflow
```

Run the complete pipeline:
```
You: /lead-workflow
Claude: I'll run a complete lead generation workflow. Tell me about your ideal customer.
You: I'm looking for CTOs at mid-size tech companies (50-500 employees) in the US who work with AI/ML. I need 50 leads exported to CSV.
Claude: Perfect! I'll:
1. Search for 50 CTOs at 50-500 employee companies in the US with AI/ML keywords
2. Enrich all contacts in batches
3. Score each lead
4. Export to CSV sorted by score
[Executes complete workflow]
```

### MCP Tools

Use MCP tools directly for more control:

#### `search_leads`

```typescript
// In Claude Code, you can ask:
"Use the search_leads tool to find CTOs in New York"

// Claude will call:
search_leads({
  person_titles: ["CTO", "Chief Technology Officer"],
  person_seniorities: ["c_suite"],
  person_locations: ["New York, NY"],
  per_page: 25
})
```

#### `enrich_contact`

```typescript
"Enrich this person: john.doe@company.com"

// Calls:
enrich_contact({
  email: "john.doe@company.com",
  reveal_personal_emails: true,
  reveal_phone_number: true
})
```

#### `bulk_enrich_contacts`

```typescript
"Enrich these 5 contacts: [list]"

// Calls:
bulk_enrich_contacts({
  contacts: [
    { email: "john@co.com" },
    { linkedin_url: "https://..." },
    { first_name: "Jane", last_name: "Doe", organization_name: "Acme" }
  ]
})
```

#### `score_lead`

```typescript
"Score this lead against my target criteria"

// Calls:
score_lead({
  person: { /* person object */ },
  target_titles: ["CTO", "VP Engineering"],
  target_seniorities: ["c_suite", "vp"]
})
```

#### `export_leads`

```typescript
"Export these leads to CSV"

// Calls:
export_leads({
  leads: [ /* array of leads */ ],
  format: "csv",
  fields: ["name", "email", "title", "company"]
})
```

### Complete Workflows

#### Workflow 1: Find and Export Decision Makers

```
Goal: Find 100 C-level executives at Series A/B startups in tech hubs

1. /search-leads
   - Titles: CEO, CTO, CFO, COO
   - Seniority: c_suite
   - Locations: San Francisco, New York, Austin
   - Company size: 11,50 and 51,200
   - Per page: 100

2. /score-leads
   - Target titles: CEO, CTO, CFO
   - Target seniority: c_suite

3. /export-leads
   - Format: CSV
   - Fields: name, email, title, company, linkedin, score, location
   - Filter: Only A and B grades
```

#### Workflow 2: Enrich Existing List

```
Goal: Enrich a list of 50 LinkedIn URLs from a conference

1. Prepare your list in a text file

2. /enrich-contact
   - Paste all 50 LinkedIn URLs (Claude will batch them automatically)

3. /score-leads
   - Score all enriched contacts

4. /export-leads
   - Export to JSON for CRM import
```

#### Workflow 3: Targeted Account-Based Marketing

```
Goal: Find all decision-makers at 10 specific companies

1. /search-leads (Run 10 times or use organization_ids if you have them)
   - For each company, search by organization name
   - Filter by titles: VP, Director, C-suite

2. /enrich-contact (bulk)
   - Enrich all found contacts in batches of 10

3. /score-leads
   - Score based on title relevance to your campaign

4. /export-leads
   - Export to CSV grouped by company
```

---

## 📖 API Reference

### Search Filters

<table>
<tr><th>Parameter</th><th>Type</th><th>Description</th><th>Example</th></tr>
<tr>
  <td><code>person_titles</code></td>
  <td>string[]</td>
  <td>Job titles to search</td>
  <td><code>["CEO", "CTO"]</code></td>
</tr>
<tr>
  <td><code>person_seniorities</code></td>
  <td>string[]</td>
  <td>Seniority levels</td>
  <td><code>["c_suite", "vp", "director"]</code></td>
</tr>
<tr>
  <td><code>person_locations</code></td>
  <td>string[]</td>
  <td>Geographic locations</td>
  <td><code>["New York, NY", "United States"]</code></td>
</tr>
<tr>
  <td><code>q_keywords</code></td>
  <td>string</td>
  <td>Keywords in profile</td>
  <td><code>"machine learning AI"</code></td>
</tr>
<tr>
  <td><code>organization_num_employees_ranges</code></td>
  <td>string[]</td>
  <td>Company size</td>
  <td><code>["1,10", "11,50", "51,200"]</code></td>
</tr>
<tr>
  <td><code>per_page</code></td>
  <td>number</td>
  <td>Results per page (max 100)</td>
  <td><code>25</code></td>
</tr>
</table>

### Seniority Levels

- `entry` - Entry level
- `senior` - Senior level
- `manager` - Manager level
- `director` - Director level
- `vp` - VP level
- `c_suite` - C-Suite (CEO, CTO, etc.)

### Company Size Ranges

- `1,10` - 1-10 employees
- `11,50` - 11-50 employees
- `51,200` - 51-200 employees
- `201,500` - 201-500 employees
- `501,1000` - 501-1,000 employees
- `1001,10000` - 1,001-10,000 employees
- `10001+` - 10,001+ employees

### Lead Scoring

**Score Breakdown:**
- **Email available:** 20 points
- **Phone available:** 15 points
- **LinkedIn available:** 10 points
- **Title relevance:** 0-25 points (10 × 2.5 multiplier)
- **Seniority level:** 0-20 points (0-10 × 2 multiplier)
- **Data completeness:** 0-15 points (0-10 × 1.5 multiplier)

**Grades:**
- **A (90-100):** Excellent - High priority
- **B (75-89):** Good - Strong potential
- **C (60-74):** Fair - Worth nurturing
- **D (45-59):** Poor - Needs more data
- **F (0-44):** Very poor - Skip or revisit

---

## 🎯 Best Practices

### 1. Multi-Channel Outreach

**Research shows:** Combining email, phone, and LinkedIn can increase meeting bookings by **24%**.

**Recommended approach:**
1. Search for leads with phone and email
2. Filter for A/B grade leads (they have contact info)
3. Use email for initial outreach
4. Follow up with LinkedIn connection
5. Call high-value prospects

### 2. Lead Scoring Workflow

```
Search → Enrich → Score → Segment → Export
```

- **Search:** Cast a wide net
- **Enrich:** Get full contact data
- **Score:** Identify quality
- **Segment:**
  - A/B grades → Immediate outreach
  - C grades → Nurture campaign
  - D/F grades → Re-enrich later or skip
- **Export:** To your CRM or outreach tool

### 3. Batch Operations

**Use bulk enrichment** whenever possible:
- ❌ Enrich 10 contacts one-by-one: 10 API calls
- ✅ Bulk enrich 10 contacts: 1 API call

**Same for searching:**
- Set `per_page: 100` to get more results per search
- Use pagination instead of multiple searches

### 4. Data Quality

**Always enable:**
- `reveal_personal_emails: true`
- `reveal_phone_number: true`

**Why:** These fields significantly improve lead scores and outreach success rates.

### 5. Personalization

**71% of consumers expect personalized interactions.**

After exporting leads:
1. Use title and company info for personalization
2. Reference their LinkedIn profile in outreach
3. Mention mutual connections or interests
4. Customize email templates per segment

### 6. API Credit Optimization

- **Search operations:** FREE (don't consume credits)
- **Enrichment:** Consumes credits per contact
- **Strategy:**
  1. Search broadly (free)
  2. Score search results without enrichment (free)
  3. Only enrich top-scoring leads (costs credits)
  4. Use bulk enrichment for efficiency

---

## 🔧 Troubleshooting

### MCP Server Not Loading

**Symptoms:** Tools not available in Claude Code

**Solutions:**
1. Check MCP config path is correct:
   ```bash
   cat ~/.claude/.mcp.json
   ```

2. Verify the path to `dist/index.js` is absolute:
   ```bash
   ls /full/path/to/lead-generation-apollo/dist/index.js
   ```

3. Test the server manually:
   ```bash
   cd lead-generation-apollo
   node dist/index.js
   ```
   (It should run without errors)

4. Check Claude Code logs:
   - Look for MCP server connection errors
   - Verify API key is set correctly

5. Restart Claude Code after config changes

### API Key Errors

**Symptoms:** "APOLLO_API_KEY environment variable is required"

**Solutions:**
1. Verify `.env` file exists and has the key:
   ```bash
   cat .env
   ```

2. Check MCP config has the env variable:
   ```json
   "env": {
     "APOLLO_API_KEY": "your_actual_key_here"
   }
   ```

3. Make sure there are no extra spaces or quotes in the key

### Build Errors

**Symptoms:** TypeScript compilation fails

**Solutions:**
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Slash Commands Not Working

**Symptoms:** Commands don't show up with `/`

**Solutions:**
1. Check commands are in the right location:
   ```bash
   ls ~/.claude/commands/
   # or
   ls .claude/commands/
   ```

2. Verify files end with `.md`

3. Check they have the frontmatter:
   ```markdown
   ---
   description: Command description
   ---
   ```

4. Restart Claude Code

### Rate Limiting

**Symptoms:** "Rate limit exceeded" errors

**Solutions:**
1. Apollo.io has rate limits based on your plan
2. Add delays between bulk operations
3. Reduce `per_page` in searches
4. Contact Apollo.io to increase limits

---

## 🏗️ Architecture

### Project Structure

```
lead-generation-apollo/
├── .claude/
│   └── commands/              # Slash commands
│       ├── search-leads.md
│       ├── enrich-contact.md
│       ├── score-leads.md
│       ├── export-leads.md
│       └── lead-workflow.md
├── .claude-plugin/
│   └── manifest.json          # Plugin metadata
├── src/
│   ├── index.ts               # MCP server entry point
│   ├── apollo-client.ts       # Apollo.io API wrapper
│   ├── types.ts               # TypeScript definitions
│   └── tools/                 # MCP tools
│       ├── search-leads.ts    # Search tool
│       ├── enrich-contact.ts  # Single enrichment
│       ├── bulk-enrich.ts     # Bulk enrichment
│       ├── score-lead.ts      # Lead scoring
│       └── export-leads.ts    # Data export
├── dist/                      # Compiled JavaScript (generated)
├── .env                       # API keys (not in git)
├── .env.example               # Example env file
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── install.sh                 # Installation script
└── README.md                  # This file
```

### Technology Stack

- **Runtime:** Node.js v18+
- **Language:** TypeScript 5.7
- **Protocol:** MCP (Model Context Protocol)
- **SDK:** @modelcontextprotocol/sdk ^1.0.4
- **HTTP Client:** Axios ^1.7.7
- **Validation:** Zod ^3.23.8
- **API:** Apollo.io REST API v1

### Data Flow

```
User → Claude Code → Slash Command/MCP Tool
                             ↓
                        MCP Server (this plugin)
                             ↓
                     Apollo.io API Client
                             ↓
                       Apollo.io API
                             ↓
                     Results Processing
                             ↓
                   Return to Claude Code
                             ↓
                    Display to User
```

---

## 📚 Resources

### Apollo.io Documentation
- [People Search API](https://docs.apollo.io/reference/people-api-search) - Search people using filters
- [People Enrichment](https://docs.apollo.io/reference/people-enrichment) - Enrich single person
- [Bulk Enrichment](https://docs.apollo.io/reference/bulk-people-enrichment) - Enrich up to 10 people
- [API Overview](https://docs.apollo.io/docs/api-overview) - General API documentation

### Lead Generation Best Practices (2025)
- [Lead Generation Best Practices](https://www.apollo.io/magazine/lead-generation-best-practices-for-filling-your-sales-pipeline) - Apollo's official guide
- [Cold Email Success with Apollo](https://scrupp.com/blog/apollo-lead-generation) - Maximize outreach
- [Apollo Lead Generation Tools](https://www.kaspr.io/blog/apollo-lead-generation) - Features & benefits
- [Master Apollo for Lead Generation 2025](https://mindustrious.com/blog/master-apolloio-for-lead-generation-complete-guide-2025/) - Complete guide

### Claude Code & MCP
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) - Official SDK
- [Claude Code Plugins](https://www.anthropic.com/news/claude-code-plugins) - Plugin system
- [Add MCP Servers to Claude Code](https://www.docker.com/blog/add-mcp-servers-to-claude-code-with-mcp-toolkit/) - Setup guide
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices) - Agentic coding
- [MCP Documentation](https://modelcontextprotocol.io/) - Protocol specification

### Getting API Keys
- [Apollo.io Signup](https://apollo.io) - Get your Apollo API key
- [Netmind AI Services](https://www.netmind.ai/AIServices/apollo-io) - Alternative Apollo MCP

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

MIT License - see LICENSE file for details

## 💬 Support

- **Plugin Issues:** Create an issue in this repository
- **Apollo.io API:** [Apollo Knowledge Base](https://knowledge.apollo.io/hc/en-us/)
- **Claude Code:** [Claude Documentation](https://docs.claude.com/)

---

<div align="center">

**Built with ❤️ for the Claude Code community**

[⬆ Back to Top](#lead-generation-apollo---claude-code-plugin)

</div>
