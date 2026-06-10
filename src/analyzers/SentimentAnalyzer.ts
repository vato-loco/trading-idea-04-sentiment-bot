import { BaseAnalyzer } from './BaseAnalyzer';
import { NewsItem, SentimentScore } from '../types';
import Sentiment from 'sentiment';

export class SentimentAnalyzer extends BaseAnalyzer<NewsItem[]> {
  private sentiment: Sentiment;

  constructor() {
    super('NewsSentimentAnalyzer');
    this.sentiment = new Sentiment();
  }

  async analyze(newsItems: NewsItem[]): Promise<SentimentScore> {
    if (!newsItems || newsItems.length === 0) {
      return { score: 0, confidence: 0, source: this.analyzerName, timestamp: new Date() };
    }

    const totalScore = newsItems.reduce((sum, item) => {
      const lexiconResult = this.sentiment.analyze(item.title);
      // Normalize lexicon score (-5 to 5 scale roughly) to -1 to 1
      const textScore = Math.max(-1, Math.min(1, lexiconResult.comparative));
      return sum + textScore;
    }, 0);

    const finalScore = totalScore / newsItems.length;

    return {
      score: Math.max(-1, Math.min(1, finalScore)),
      confidence: Math.min(newsItems.length / 50, 1),
      source: this.analyzerName,
      timestamp: new Date()
    };
  }
}
