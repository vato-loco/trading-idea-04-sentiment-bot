import { BaseAnalyzer } from './BaseAnalyzer';
import { CryptoPanicNews, SentimentScore } from '../types';

export class SentimentAnalyzer extends BaseAnalyzer<CryptoPanicNews[]> {
  constructor() {
    super('BasicCryptoPanicAnalyzer');
  }

  async analyze(newsItems: CryptoPanicNews[]): Promise<SentimentScore> {
    if (!newsItems || newsItems.length === 0) {
      return { score: 0, confidence: 0, source: this.analyzerName, timestamp: new Date() };
    }

    let totalScore = 0;
    
    // Naive sentiment analysis based on upvotes/downvotes
    newsItems.forEach(item => {
      const positive = item.votes.positive + item.votes.bullish || 0; // if bullish exists
      const negative = item.votes.negative + item.votes.bearish || 0; // if bearish exists
      
      if (positive > negative) {
        totalScore += 1;
      } else if (negative > positive) {
        totalScore -= 1;
      }
    });

    const normalizedScore = totalScore / newsItems.length;

    return {
      score: normalizedScore,
      confidence: Math.min(newsItems.length / 100, 1), // Confidence based on number of articles
      source: this.analyzerName,
      timestamp: new Date()
    };
  }
}
