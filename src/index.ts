import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { RssNewsFetcher } from './fetchers/RssNewsFetcher';
import { FearAndGreedFetcher } from './fetchers/FearAndGreedFetcher';
import { SentimentAnalyzer } from './analyzers/SentimentAnalyzer';
import { FearAndGreedAnalyzer } from './analyzers/FearAndGreedAnalyzer';

dotenv.config();

async function main() {
  console.log('--- Sentiment Bot MVP Starting ---');

  const newsFetcher = new RssNewsFetcher();
  const fngFetcher = new FearAndGreedFetcher();
  const sentimentAnalyzer = new SentimentAnalyzer();
  const fngAnalyzer = new FearAndGreedAnalyzer();

  try {
    // 1. Fetch Data
    console.log('Fetching data from RSS news feeds and Alternative.me...');
    const [news, fngData] = await Promise.all([
      newsFetcher.fetch(),
      fngFetcher.fetch()
    ]);

    // 2. Analyze Data
    console.log('Analyzing data...');
    const newsScore = await sentimentAnalyzer.analyze(news);
    const fngScore = await fngAnalyzer.analyze(fngData);

    // 3. Aggregate
    // Base weights: News sentiment (60%), Fear & Greed Index (40%),
    // scaled by each source's confidence so a low-confidence reading
    // (e.g. very few news items) doesn't drag the signal as hard.
    const newsWeight = 0.6 * newsScore.confidence;
    const fngWeight = 0.4 * fngScore.confidence;
    const totalWeight = newsWeight + fngWeight;

    const aggregateScore = totalWeight > 0
      ? ((newsScore.score * newsWeight) + (fngScore.score * fngWeight)) / totalWeight
      : 0;

    // 4. Discreet Signal
    let signal = 'NEUTRAL';
    if (aggregateScore >= 0.25) signal = 'BULLISH';
    if (aggregateScore <= -0.25) signal = 'BEARISH';

    const result = {
      timestamp: new Date().toISOString(),
      source_scores: {
        news: newsScore,
        fear_and_greed: fngScore
      },
      aggregate: {
        score: parseFloat(aggregateScore.toFixed(4)),
        signal: signal
      }
    };

    // 5. Output
    console.log('\n--- RESULTS ---');
    console.log(`Signal: ${signal}`);
    console.log(`Aggregate Score: ${result.aggregate.score}`);
    console.log(`News Score: ${newsScore.score.toFixed(4)}`);
    console.log(`Fear & Greed Score: ${fngScore.score.toFixed(4)}`);

    const outputDir = path.join(__dirname, '../output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    fs.writeFileSync(
      path.join(outputDir, 'latest.json'),
      JSON.stringify(result, null, 2)
    );
    console.log(`\nPersisted result to output/latest.json`);

  } catch (error) {
    console.error('Fatal error in sentiment bot:', error);
  }
}

main();
