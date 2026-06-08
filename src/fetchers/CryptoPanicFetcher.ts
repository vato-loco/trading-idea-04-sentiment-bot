import axios from 'axios';
import { CryptoPanicResponse } from '../types';

export class CryptoPanicFetcher {
  private readonly baseUrl = 'https://cryptopanic.com/api/v1';
  private readonly apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.CRYPTOPANIC_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Warning: CRYPTOPANIC_API_KEY is not set.');
    }
  }

  async fetchNews(filter?: 'rising' | 'hot' | 'bullish' | 'bearish' | 'important', currencies?: string[]): Promise<CryptoPanicResponse | null> {
    try {
      const params: any = {
        auth_token: this.apiKey,
        public: true,
      };

      if (filter) params.filter = filter;
      if (currencies && currencies.length > 0) params.currencies = currencies.join(',');

      const response = await axios.get<CryptoPanicResponse>(`${this.baseUrl}/posts/`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching data from CryptoPanic:', error);
      return null;
    }
  }
}
