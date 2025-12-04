/**
 * Lead Scoring Tool
 * Score leads based on data quality and relevance
 */

import { z } from 'zod';
import type { Person, LeadScore } from '../types.js';

export const scoreLeadSchema = z.object({
  person: z.object({
    id: z.string(),
    name: z.string(),
    title: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    phone_numbers: z.array(z.any()).optional(),
    linkedin_url: z.string().optional().nullable(),
  }).describe('Person object to score'),
  target_titles: z.array(z.string()).optional().describe('Target job titles for relevance scoring'),
  target_seniorities: z.array(z.string()).optional().describe('Target seniority levels'),
});

export type ScoreLeadInput = z.infer<typeof scoreLeadSchema>;

const SENIORITY_SCORES: Record<string, number> = {
  'c_suite': 10,
  'vp': 9,
  'director': 8,
  'senior': 7,
  'manager': 6,
  'entry': 4,
};

function calculateTitleRelevance(title: string | null | undefined, targetTitles?: string[]): number {
  if (!title) return 0;
  if (!targetTitles || targetTitles.length === 0) return 5;

  const lowerTitle = title.toLowerCase();
  const matches = targetTitles.filter(target =>
    lowerTitle.includes(target.toLowerCase())
  );

  return matches.length > 0 ? 10 : 0;
}

function calculateSeniorityLevel(title: string | null | undefined, targetSeniorities?: string[]): number {
  if (!title) return 0;

  const lowerTitle = title.toLowerCase();

  // Check target seniorities first
  if (targetSeniorities && targetSeniorities.length > 0) {
    for (const seniority of targetSeniorities) {
      if (lowerTitle.includes(seniority.toLowerCase())) {
        return SENIORITY_SCORES[seniority.toLowerCase()] || 5;
      }
    }
  }

  // Default seniority detection
  if (lowerTitle.includes('ceo') || lowerTitle.includes('cto') || lowerTitle.includes('cfo') || lowerTitle.includes('chief')) {
    return SENIORITY_SCORES.c_suite;
  }
  if (lowerTitle.includes('vp') || lowerTitle.includes('vice president')) {
    return SENIORITY_SCORES.vp;
  }
  if (lowerTitle.includes('director')) {
    return SENIORITY_SCORES.director;
  }
  if (lowerTitle.includes('senior') || lowerTitle.includes('sr.')) {
    return SENIORITY_SCORES.senior;
  }
  if (lowerTitle.includes('manager') || lowerTitle.includes('lead')) {
    return SENIORITY_SCORES.manager;
  }

  return SENIORITY_SCORES.entry;
}

function calculateDataCompleteness(person: any): number {
  let score = 0;
  const fields = [
    person.name,
    person.title,
    person.email,
    person.phone_numbers?.length > 0,
    person.linkedin_url,
  ];

  const filledFields = fields.filter(Boolean).length;
  score = (filledFields / fields.length) * 10;

  return Math.round(score);
}

export function scoreLead(input: ScoreLeadInput): LeadScore {
  const { person, target_titles, target_seniorities } = input;

  const hasEmail = !!person.email;
  const hasPhone = !!(person.phone_numbers && person.phone_numbers.length > 0);
  const hasLinkedin = !!person.linkedin_url;

  const titleRelevance = calculateTitleRelevance(person.title, target_titles);
  const seniorityLevel = calculateSeniorityLevel(person.title, target_seniorities);
  const dataCompleteness = calculateDataCompleteness(person);

  // Calculate total score (out of 100)
  const score = Math.round(
    (hasEmail ? 20 : 0) +
    (hasPhone ? 15 : 0) +
    (hasLinkedin ? 10 : 0) +
    (titleRelevance * 2.5) +
    (seniorityLevel * 2) +
    (dataCompleteness * 1.5)
  );

  // Assign grade
  let grade: LeadScore['grade'];
  if (score >= 90) grade = 'A';
  else if (score >= 75) grade = 'B';
  else if (score >= 60) grade = 'C';
  else if (score >= 45) grade = 'D';
  else grade = 'F';

  return {
    person_id: person.id,
    score,
    max_score: 100,
    factors: {
      has_email: hasEmail,
      has_phone: hasPhone,
      has_linkedin: hasLinkedin,
      title_relevance: titleRelevance,
      seniority_level: seniorityLevel,
      data_completeness: dataCompleteness,
    },
    grade,
  };
}

export async function scoreLeadTool(input: ScoreLeadInput) {
  const result = scoreLead(input);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          ...result,
          interpretation: {
            grade: result.grade,
            score: `${result.score}/100`,
            quality: result.grade === 'A' || result.grade === 'B' ? 'High Quality Lead' :
              result.grade === 'C' ? 'Medium Quality Lead' : 'Low Quality Lead',
          },
        }, null, 2),
      },
    ],
  };
}
