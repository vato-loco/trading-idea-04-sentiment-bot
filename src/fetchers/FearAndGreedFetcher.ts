import axios from 'axios';
import { FearAndGreedResponse, FearAndGreedData } from '../types';

export class FearAndGreedFetcher {
  private readonly url = 'https://api.alternative.me/fng/';

  async fetch(): Promise<FearAndGreedData[]> {
    try {
      const response = await axios.get<FearAndGreedResponse>(this.url);
      if (response.data.metadata.error) {
        throw new Error(`API Error: ${response.data.metadata.error}`);
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching Fear & Greed Index:', error);
      return [];
    }
  }
}
