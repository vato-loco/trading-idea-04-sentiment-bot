import { BaseAnalyzer } from './BaseAnalyzer';
import { CryptoPanicNews, SentimentScore } from '../types';
import Sentiment from 'sentiment';

export class SentimentAnalyzer extends BaseAnalyzer<CryptoPanicNews[]> {
  private sentiment: Sentiment;

  constructor() {
    super('CryptoPanicSentimentAnalyzer');
    this.sentiment = new Sentiment();
  }

  async analyze(newsItems: CryptoPanicNews[]): Promise<SentimentScore> {
    if (!newsItems || newsItems.length === 0) {
      return { score: 0, confidence: 0, source: this.analyzerName, timestamp: new Date() };
    }

    let weightedTotalScore = 0;
    
    newsItems.forEach(item => {
      // 1. Lexicon-based sentiment analysis on the title
      const lexiconResult = this.sentiment.analyze(item.title);
      // Normalize lexicon score (-5 to 5 scale roughly) to -1 to 1
      const textScore = Math.max(-1, Math.min(1, lexiconResult.comparative));

      // 2. Vote-based signal
      const positive = (item.votes.positive || 0) + (item.votes.bullish || 0) + (item.votes.liked || 0);
      const negative = (item.votes.negative || 0) + (item.votes.bearish || 0) + (item.votes.disliked || 0);
      
      let voteScore = 0;
      if (positive > negative) {
        voteScore = 0.5;
      } else if (negative > positive) {
        voteScore = -0.5;
      }

      // Combine text sentiment (70%) and vote signal (30%)
      weightedTotalScore += (textScore * 0.7) + (voteScore * 0.3);
    });

    const finalScore = weightedTotalScore / newsItems.length;

    return {
      score: Math.max(-1, Math.min(1, finalScore)),
      confidence: Math.min(newsItems.length / 50, 1),
      source: this.analyzerName,
      timestamp: new Date()
    };
  }
}
