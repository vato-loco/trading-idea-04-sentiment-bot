import { SentimentScore } from '../types';

export abstract class BaseAnalyzer<T> {
  protected analyzerName: string;

  constructor(analyzerName: string) {
    this.analyzerName = analyzerName;
  }

  abstract analyze(data: T): Promise<SentimentScore>;
  
  getAnalyzerName(): string {
    return this.analyzerName;
  }
}
