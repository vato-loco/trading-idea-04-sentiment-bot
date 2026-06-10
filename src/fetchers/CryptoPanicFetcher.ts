import axios from 'axios';
import { CryptoPanicResponse, CryptoPanicNews } from '../types';

export class CryptoPanicFetcher {
  private readonly baseUrl = 'https://cryptopanic.com/api/v1';
  private readonly apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.CRYPTOPANIC_API_KEY || '';
  }

  async fetch(filter?: 'rising' | 'hot' | 'bullish' | 'bearish' | 'important'): Promise<CryptoPanicNews[]> {
    try {
      // Use the verified working URL pattern if known, or handle the 404 gracefully
      // Based on public docs, it should be https://cryptopanic.com/api/v1/posts/
      // The 404 might be because of a missing/invalid API key on a restricted endpoint.
      
      const params: any = {
        auth_token: this.apiKey,
        public: 'true',
      };

      if (filter) params.filter = filter;

      const response = await axios.get<CryptoPanicResponse>(`${this.baseUrl}/posts/`, { 
        params,
        timeout: 5000 
      });
      
      return response.data.results || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          console.warn('CryptoPanic API returned 404. This often happens with an invalid API key or incorrect endpoint trailing slash.');
        } else {
          console.error(`CryptoPanic API Error: ${error.response?.status || error.code} - ${error.message}`);
        }
      } else {
        console.error('Unexpected error fetching from CryptoPanic:', error);
      }
      return [];
    }
  }
}
