/**
 * Type definitions for lead generation plugin
 */

export interface LeadSearchFilters {
  // Person filters
  person_titles?: string[];
  person_seniorities?: string[];
  person_locations?: string[];
  q_keywords?: string;

  // Organization filters
  organization_ids?: string[];
  organization_num_employees_ranges?: string[];
  organization_locations?: string[];
  organization_industry_tag_ids?: string[];

  // Pagination
  page?: number;
  per_page?: number;
}

export interface Person {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  title: string;
  email: string | null;
  email_status: string | null;
  phone_numbers: PhoneNumber[];
  linkedin_url: string | null;
  organization_id: string | null;
  organization_name: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
}

export interface PhoneNumber {
  raw_number: string;
  sanitized_number: string;
  type: string;
  position: number;
  status: string;
}

export interface Organization {
  id: string;
  name: string;
  website_url: string | null;
  linkedin_url: string | null;
  primary_domain: string | null;
  industry: string | null;
  estimated_num_employees: number | null;
  city: string | null;
  state: string | null;
  country: string | null;
}

export interface SearchResult {
  people: Person[];
  pagination: {
    page: number;
    per_page: number;
    total_entries: number;
    total_pages: number;
  };
}

export interface EnrichmentRequest {
  first_name?: string;
  last_name?: string;
  organization_name?: string;
  domain?: string;
  email?: string;
  linkedin_url?: string;
  reveal_personal_emails?: boolean;
  reveal_phone_number?: boolean;
}

export interface EnrichmentResult {
  person: Person | null;
  organization: Organization | null;
}

export interface LeadScore {
  person_id: string;
  score: number;
  max_score: number;
  factors: {
    has_email: boolean;
    has_phone: boolean;
    has_linkedin: boolean;
    title_relevance: number;
    seniority_level: number;
    data_completeness: number;
  };
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface ExportOptions {
  format: 'csv' | 'json';
  fields?: string[];
  filename?: string;
}
