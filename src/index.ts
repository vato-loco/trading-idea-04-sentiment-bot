import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { CryptoPanicFetcher } from './fetchers/CryptoPanicFetcher';
import { FearAndGreedFetcher } from './fetchers/FearAndGreedFetcher';
import { SentimentAnalyzer } from './analyzers/SentimentAnalyzer';
import { FearAndGreedAnalyzer } from './analyzers/FearAndGreedAnalyzer';

dotenv.config();

async function main() {
  console.log('--- Sentiment Bot MVP Starting ---');

  const cpFetcher = new CryptoPanicFetcher();
  const fngFetcher = new FearAndGreedFetcher();
  const sentimentAnalyzer = new SentimentAnalyzer();
  const fngAnalyzer = new FearAndGreedAnalyzer();

  try {
    // 1. Fetch Data
    console.log('Fetching data from CryptoPanic and Alternative.me...');
    const [news, fngData] = await Promise.all([
      cpFetcher.fetch(),
      fngFetcher.fetch()
    ]);

    // 2. Analyze Data
    console.log('Analyzing data...');
    const cpScore = await sentimentAnalyzer.analyze(news);
    const fngScore = await fngAnalyzer.analyze(fngData);

    // 3. Aggregate
    // Weight: CryptoPanic news (60%), Fear & Greed Index (40%)
    const aggregateScore = (cpScore.score * 0.6) + (fngScore.score * 0.4);
    
    // 4. Discreet Signal
    let signal = 'NEUTRAL';
    if (aggregateScore >= 0.25) signal = 'BULLISH';
    if (aggregateScore <= -0.25) signal = 'BEARISH';

    const result = {
      timestamp: new Date().toISOString(),
      source_scores: {
        cryptopanic: cpScore,
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
    console.log(`CryptoPanic Score: ${cpScore.score.toFixed(4)}`);
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
