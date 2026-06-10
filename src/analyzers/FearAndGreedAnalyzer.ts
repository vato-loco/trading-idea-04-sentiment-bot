import { BaseAnalyzer } from './BaseAnalyzer';
import { FearAndGreedData, SentimentScore } from '../types';

export class FearAndGreedAnalyzer extends BaseAnalyzer<FearAndGreedData[]> {
  constructor() {
    super('FearAndGreedAnalyzer');
  }

  async analyze(data: FearAndGreedData[]): Promise<SentimentScore> {
    if (!data || data.length === 0) {
      return { score: 0, confidence: 0, source: this.analyzerName, timestamp: new Date() };
    }

    const latest = data[0];
    const value = parseInt(latest.value);

    // Convert 0-100 to -1 to 1 scale
    // 0 = Extreme Fear (-1)
    // 50 = Neutral (0)
    // 100 = Extreme Greed (1)
    const score = (value - 50) / 50;

    return {
      score: score,
      confidence: 1.0,
      source: this.analyzerName,
      timestamp: new Date()
    };
  }
}
