---
description: Search for potential leads using Apollo.io with advanced filters
---

# Lead Search

I'll help you search for potential leads using the Apollo.io database. Let me gather the search criteria.

## Search Criteria

Please provide the following information (all optional, but at least one should be specified):

**Person Filters:**
- Job titles to search for (e.g., "CEO", "CTO", "VP of Sales")
- Seniority levels (options: "entry", "senior", "manager", "director", "vp", "c_suite")
- Geographic locations (e.g., "United States", "New York, NY", "San Francisco Bay Area")
- Keywords to search in profiles

**Company Filters:**
- Company size ranges (e.g., "1,10", "11,50", "51,200", "201,500", "501,1000", "1001,10000", "10001+")
- Company locations
- Industry tags

**Pagination:**
- Number of results per page (default: 25, max: 100)
- Page number (default: 1)

Once you provide the criteria, I'll use the `search_leads` MCP tool to find matching leads and display the results in a structured format.

## Example Searches

1. **Find CTOs in tech companies:**
   - Titles: ["CTO", "Chief Technology Officer"]
   - Seniority: ["c_suite"]
   - Company size: ["51,200", "201,500"]

2. **Find decision-makers in New York:**
   - Titles: ["CEO", "VP of Sales", "Director of Marketing"]
   - Location: ["New York, NY"]
   - Seniority: ["c_suite", "vp", "director"]

3. **Find AI/ML professionals:**
   - Keywords: "machine learning artificial intelligence"
   - Titles: ["Machine Learning Engineer", "AI Researcher"]
   - Seniority: ["senior", "director"]

What would you like to search for?
