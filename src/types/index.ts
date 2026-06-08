export interface CryptoPanicNews {
  kind: string;
  domain: string;
  title: string;
  published_at: string;
  slug: string;
  url: string;
  id: number;
  votes: {
    negative: number;
    positive: number;
    important: number;
    liked: number;
    disliked: number;
    lol: number;
    toxic: number;
    saved: number;
    comments: number;
  };
}

export interface CryptoPanicResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CryptoPanicNews[];
}

export interface SentimentScore {
  score: number; // -1 to 1
  confidence: number;
  source: string;
  timestamp: Date;
}
