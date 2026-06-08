import * as dotenv from 'dotenv';
import { CryptoPanicFetcher } from './fetchers/CryptoPanicFetcher';
import { SentimentAnalyzer } from './analyzers/SentimentAnalyzer';

dotenv.config();

async function main() {
  console.log('Starting Sentiment Bot...');

  // Initialize fetcher
  const fetcher = new CryptoPanicFetcher();
  
  console.log('Fetching recent news...');
  const newsData = await fetcher.fetchNews();

  if (newsData && newsData.results) {
    console.log(`Fetched ${newsData.results.length} news items.`);
    
    // Initialize analyzer
    const analyzer = new SentimentAnalyzer();
    
    console.log('Analyzing sentiment...');
    const sentiment = await analyzer.analyze(newsData.results);
    
    console.log('Sentiment Analysis Result:');
    console.table(sentiment);
  } else {
    console.log('Failed to fetch news or no results found.');
  }
}

main().catch(console.error);
