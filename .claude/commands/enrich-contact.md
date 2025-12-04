---
description: Enrich contact information with email, phone, LinkedIn, and company data
---

# Contact Enrichment

I'll help you enrich contact information using Apollo.io. This will reveal emails, phone numbers, LinkedIn profiles, and detailed company information.

## What You Can Enrich

You can enrich a contact by providing **any** of the following:

**Person Information:**
- Email address
- LinkedIn URL
- First name + Last name (optionally with company name)

**Company Information:**
- Company domain (e.g., "apollo.io")
- Company name

## Enrichment Options

By default, I will:
- ✅ Reveal personal email addresses
- ✅ Reveal phone numbers
- ✅ Get LinkedIn profile information
- ✅ Fetch company details (size, industry, location)

## Single Contact Enrichment

Provide the contact details you have, and I'll use the `enrich_contact` tool to find complete information.

**Example 1 - Enrich by email:**
```
Email: john.doe@company.com
```

**Example 2 - Enrich by LinkedIn:**
```
LinkedIn URL: https://www.linkedin.com/in/johndoe
```

**Example 3 - Enrich by name and company:**
```
First Name: John
Last Name: Doe
Company: Acme Corporation
```

## Bulk Contact Enrichment (Up to 10)

If you have multiple contacts (2-10), I can enrich them all at once using the `bulk_enrich_contacts` tool. This is more efficient and faster than enriching one by one.

**Bulk example:**
```
1. john.doe@company1.com
2. https://www.linkedin.com/in/janedoe
3. Bob Smith at Tech Corp
```

---

What contact(s) would you like to enrich?
