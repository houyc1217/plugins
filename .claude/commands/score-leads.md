---
description: Score leads based on data quality and relevance to target criteria
---

# Lead Scoring

I'll help you score leads to prioritize your outreach efforts. The scoring system evaluates leads on a scale of 0-100 and assigns letter grades (A-F).

## Scoring Factors

The lead scoring algorithm considers:

**Contact Information (45 points total):**
- Has email: 20 points
- Has phone: 15 points
- Has LinkedIn: 10 points

**Title Relevance (25 points):**
- Matches your target job titles: 0-10 points (multiplied by 2.5)

**Seniority Level (20 points):**
- C-Suite: 10 points (×2 = 20)
- VP: 9 points (×2 = 18)
- Director: 8 points (×2 = 16)
- Senior: 7 points (×2 = 14)
- Manager: 6 points (×2 = 12)

**Data Completeness (15 points):**
- Based on how many fields are filled: 0-10 points (multiplied by 1.5)

## Grading Scale

- **A (90-100)**: High-priority, excellent quality lead
- **B (75-89)**: High-quality, strong potential
- **C (60-74)**: Medium quality, worth nurturing
- **D (45-59)**: Low quality, may need more data
- **F (0-44)**: Very low quality, skip or revisit later

## How to Use

Provide:
1. The lead/person object (from search results)
2. (Optional) Your target job titles for relevance scoring
3. (Optional) Your target seniority levels

I'll use the `score_lead` tool to calculate the score and provide a detailed breakdown.

## Example Usage

**After searching for leads:**
"Score this lead for me. My target titles are: CTO, VP of Engineering, Director of Engineering. Target seniority: c_suite, vp, director."

**For multiple leads:**
"Score all the leads from the search results using the same criteria."

---

Would you like to score a lead? If you just ran a search, I can score those results for you.
