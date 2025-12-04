/**
 * Apollo.io API Client
 * Handles direct API calls to Apollo.io for lead generation
 */

import axios, { AxiosInstance } from 'axios';
import type {
  LeadSearchFilters,
  SearchResult,
  EnrichmentRequest,
  EnrichmentResult
} from './types.js';

export class ApolloClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: 'https://api.apollo.io/v1',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
  }

  /**
   * Search for people using various filters
   */
  async searchPeople(filters: LeadSearchFilters): Promise<SearchResult> {
    try {
      const response = await this.client.post('/mixed_people/search', {
        api_key: this.apiKey,
        ...filters,
        per_page: filters.per_page || 25,
        page: filters.page || 1,
      });

      return {
        people: response.data.people || [],
        pagination: response.data.pagination || {
          page: 1,
          per_page: 25,
          total_entries: 0,
          total_pages: 0,
        },
      };
    } catch (error: any) {
      throw new Error(`Apollo API search failed: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Enrich a single person's data
   */
  async enrichPerson(request: EnrichmentRequest): Promise<EnrichmentResult> {
    try {
      const response = await this.client.post('/people/match', {
        api_key: this.apiKey,
        ...request,
      });

      return {
        person: response.data.person || null,
        organization: response.data.organization || null,
      };
    } catch (error: any) {
      throw new Error(`Apollo API enrichment failed: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Bulk enrich up to 10 people at once
   */
  async bulkEnrichPeople(requests: EnrichmentRequest[]): Promise<EnrichmentResult[]> {
    try {
      if (requests.length > 10) {
        throw new Error('Bulk enrichment limited to 10 people per request');
      }

      const response = await this.client.post('/people/bulk_match', {
        api_key: this.apiKey,
        details: requests,
      });

      return response.data.matches || [];
    } catch (error: any) {
      throw new Error(`Apollo API bulk enrichment failed: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get person by email
   */
  async getPersonByEmail(email: string, revealPersonalEmails = false): Promise<EnrichmentResult> {
    return this.enrichPerson({
      email,
      reveal_personal_emails: revealPersonalEmails,
      reveal_phone_number: true,
    });
  }

  /**
   * Get person by LinkedIn URL
   */
  async getPersonByLinkedIn(linkedinUrl: string): Promise<EnrichmentResult> {
    return this.enrichPerson({
      linkedin_url: linkedinUrl,
      reveal_personal_emails: true,
      reveal_phone_number: true,
    });
  }
}
