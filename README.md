# 🤖 Sentiment Bot — Crypto Market Signal Engine

> Combines real-time sentiment from major crypto news RSS feeds (60%) with the Fear & Greed Index (40%) to generate a definitive market signal: **BULLISH**, **BEARISH**, or **NEUTRAL**.

## Status

- [x] Concept & Research
- [x] Architecture Design
- [x] RSS News Feed Integration (CoinDesk, Cointelegraph, Decrypt)
- [x] Fear & Greed Index Integration
- [x] Sentiment Analysis Engine
- [x] Weighted Signal Aggregation
- [x] JSON Output / Persistence
- [ ] GitHub Pages Dashboard
- [ ] Telegram Alert Integration
- [ ] Scheduled Cron Execution

---

## Features

- **Dual-source sentiment scoring** — merges two independent data streams into one clear signal
- **Lexicon-based analysis** — RSS headline text analyzed locally with the `sentiment` library (AFINN lexicon), no external API required
- **Weighted aggregation** — News RSS score (60%) + Fear & Greed score (40%)
- **Discrete signal output** — score mapped to `BULLISH` / `NEUTRAL` / `BEARISH`
- **JSON persistence** — results written to `output/latest.json` for downstream use

---

## How It Works

```
RSS Feeds (CoinDesk,        Alternative.me API
  Cointelegraph, Decrypt)         │
     │                            │
     ▼                            ▼
SentimentAnalyzer          FearAndGreedAnalyzer
  - AFINN lexicon             - Scale 0–100
  - comparative score         - Maps to -1 → +1
  - normalized to -1…+1            │
     │                             │
     └──────────────┬──────────────┘
                    ▼
            Aggregate Score
        (News × 0.6) + (F&G × 0.4)
                    │
                    ▼
         ≥ +0.25 → BULLISH
         ≤ −0.25 → BEARISH
          else  → NEUTRAL
```

---

## Indicators

### 📰 News RSS Feeds (60% weight)
- Sources: [CoinDesk](https://www.coindesk.com), [Cointelegraph](https://cointelegraph.com), [Decrypt](https://decrypt.co)
- Fetches latest crypto news headlines via RSS
- Each headline is scored using the `sentiment` library (AFINN lexicon):
  - **Text sentiment** — `comparative` score normalized to −1…+1
- Final score: average across all fetched articles
- Fully client-side / local — no API key required

### 📊 Fear & Greed Index (40% weight)
- Source: [alternative.me/crypto/fear-and-greed-index](https://alternative.me/crypto/fear-and-greed-index/) API
- Returns a daily index value from 0 (Extreme Fear) to 100 (Extreme Greed)
- Mapped linearly to −1…+1: `score = (value − 50) / 50`
- Confidence: always 1.0 (single authoritative source)

---

## Technology

| Layer | Stack |
|---|---|
| Language | TypeScript 5 |
| Runtime | Node.js 18+ |
| HTTP Client | axios |
| RSS Parsing | `rss-parser` |
| Sentiment | `sentiment` (AFINN lexicon) |
| Build | `tsc` → `dist/` |
| Config | `dotenv` |

---

## Setup

```bash
# Install dependencies
npm install

# Build
npm run build

# Run
npm start
```

> No API keys required. All sentiment analysis is done locally via the `sentiment` library.

### Output

```json
{
  "timestamp": "2026-06-10T08:00:00.000Z",
  "source_scores": {
    "news": { "score": 0.32, "confidence": 0.84, "source": "SentimentAnalyzer" },
    "fear_and_greed": { "score": 0.18, "confidence": 1.0, "source": "FearAndGreedAnalyzer" }
  },
  "aggregate": {
    "score": 0.264,
    "signal": "BULLISH"
  }
}
```

---

## Deployment

### GitHub Pages Dashboard

The `docs/` folder contains a static HTML dashboard that reads from `output/latest.json`.

To deploy:
1. Push to `main`
2. Enable GitHub Pages → Source: `main` branch, `/docs` folder
3. Dashboard auto-refreshes every 60 seconds

---

## Environment Variables

No API keys required for the core signal engine. The `dotenv` setup is kept for optional future integrations.

---

## Project Structure

```
src/
├── index.ts                    # Entry point & orchestrator
├── fetchers/
│   ├── RssNewsFetcher.ts       # RSS feed client (CoinDesk, Cointelegraph, Decrypt)
│   └── FearAndGreedFetcher.ts  # Alternative.me API client
├── analyzers/
│   ├── BaseAnalyzer.ts         # Abstract base
│   ├── SentimentAnalyzer.ts    # AFINN lexicon scoring
│   └── FearAndGreedAnalyzer.ts # Index normalization
└── types/
    └── index.ts                # Shared TypeScript types
output/
└── latest.json                 # Latest signal result
docs/
└── index.html                  # GitHub Pages dashboard
```
