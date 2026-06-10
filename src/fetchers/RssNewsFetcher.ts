import Parser from 'rss-parser';
import { NewsItem } from '../types';

const DEFAULT_FEEDS: Record<string, string> = {
  CoinDesk: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
  Cointelegraph: 'https://cointelegraph.com/rss',
  Decrypt: 'https://decrypt.co/feed',
};

export class RssNewsFetcher {
  private readonly parser: Parser;
  private readonly feeds: Record<string, string>;

  constructor(feeds: Record<string, string> = DEFAULT_FEEDS) {
    this.parser = new Parser();
    this.feeds = feeds;
  }

  async fetch(): Promise<NewsItem[]> {
    const results = await Promise.allSettled(
      Object.entries(this.feeds).map(async ([source, url]) => {
        const feed = await this.parser.parseURL(url);
        return (feed.items || []).map((item): NewsItem => ({
          title: item.title || '',
          url: item.link || '',
          published_at: item.pubDate || item.isoDate || '',
          source,
        }));
      })
    );

    const news: NewsItem[] = [];
    results.forEach((result, index) => {
      const source = Object.keys(this.feeds)[index];
      if (result.status === 'fulfilled') {
        news.push(...result.value);
      } else {
        console.error(`Error fetching RSS feed for ${source}:`, result.reason);
      }
    });

    return news;
  }
}
