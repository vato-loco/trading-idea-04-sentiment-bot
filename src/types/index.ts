export interface NewsItem {
  title: string;
  url: string;
  published_at: string;
  source: string;
}

export interface SentimentScore {
  score: number; // -1 to 1
  confidence: number;
  source: string;
  timestamp: Date;
}

export interface FearAndGreedData {
  value: string;
  value_classification: string;
  timestamp: string;
  time_until_update?: string;
}

export interface FearAndGreedResponse {
  name: string;
  data: FearAndGreedData[];
  metadata: {
    error: string | null;
  };
}
