---
description: Export lead data to CSV or JSON format
---

# Export Leads

I'll help you export your lead data to a file for use in other tools or for record-keeping.

## Export Formats

**JSON Format:**
- Preserves all data structure
- Easy to import into other applications
- Best for technical use or APIs
- File extension: `.json`

**CSV Format:**
- Opens in Excel, Google Sheets, etc.
- Easy to share with non-technical teams
- Good for CRM imports
- File extension: `.csv`
- You can specify which fields to include

## Export Options

**Required:**
- Lead data (from search or enrichment results)
- Format (csv or json)

**Optional:**
- Custom filename (default: `leads-export-YYYY-MM-DD`)
- Specific fields to include (for CSV only)

## Common CSV Field Selections

**Minimal (for cold outreach):**
- name, email, title, company, linkedin

**Standard (for CRM import):**
- name, email, phone, title, company, location, linkedin

**Complete (all available data):**
- Let me include all fields automatically

## Example Usage

**After searching leads:**
```
Export these 25 leads to CSV format.
Filename: tech-ctos-nyc
Include fields: name, email, phone, title, company, linkedin
```

**After enriching contacts:**
```
Export these enriched contacts to JSON.
Filename: enriched-leads-2025-01
```

**Quick export:**
```
Export to CSV with standard fields
```

---

The file will be saved to your current working directory. What would you like to export?
