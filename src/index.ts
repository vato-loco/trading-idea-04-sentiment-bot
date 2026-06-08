import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Sentiment Bot MVP
 * Doel: Ophalen van Fear & Greed Index en voorbereiden van Social Scrapers.
 */

async function getFearAndGreedIndex() {
  try {
    const response = await axios.get('https://api.alternative.me/fng/');
    const data = response.data.data[0];
    console.log(`📊 Fear & Greed Index: ${data.value} (${data.value_classification})`);
    return data;
  } catch (error) {
    console.error('Fout bij ophalen Fear & Greed Index:', error);
  }
}

async function main() {
  console.log('⚡ Sentiment Bot Starting...');
  await getFearAndGreedIndex();
  // ToDo: Voeg X (Twitter) en Reddit scrapers toe
}

main();
