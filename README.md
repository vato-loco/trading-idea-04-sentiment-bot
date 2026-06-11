# 🤖 Sentiment Bot — Crypto Market Signal Engine

> Combines real-time news sentiment with the Fear & Greed Index to generate actionable market signals: **BULLISH**, **BEARISH**, or **NEUTRAL**.

## Status

- [x] Concept & Research
- [x] Architecture Design
- [x] CryptoPanic API Integration
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
- **Lexicon + vote analysis** — title text analyzed with the `sentiment` library (AFINN), combined with community vote signals (bullish/bearish/liked/disliked)
- **Weighted aggregation** — CryptoPanic score (60%) + Fear & Greed score (40%)
- **Discrete signal output** — score mapped to `BULLISH` / `NEUTRAL` / `BEARISH`
- **JSON persistence** — results written to `output/latest.json` for downstream use

---

## How It Works

```
CryptoPanic API         Alternative.me API
     │                        │
     ▼                        ▼
SentimentAnalyzer      FearAndGreedAnalyzer
  - Lexicon (70%)        - Scale 0–100
  - Vote signal (30%)    - Maps to -1 → +1
     │                        │
     └──────────┬─────────────┘
                ▼
        Aggregate Score
        (CP × 0.6) + (F&G × 0.4)
                │
                ▼
     ≥ +0.25 → BULLISH
     ≤ −0.25 → BEARISH
      else  → NEUTRAL
```

---

## Indicators

### 📰 CryptoPanic (60% weight)
- Source: [cryptopanic.com](https://cryptopanic.com) REST API v1
- Fetches latest crypto news posts
- Each post is scored by:
  - **Text sentiment (70%)** — AFINN lexicon analysis on the headline (`comparative` score normalized to −1…+1)
  - **Community votes (30%)** — `positive + bullish + liked` vs `negative + bearish + disliked`
- Final score: average across all fetched articles

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
| Sentiment | `sentiment` (AFINN lexicon) |
| Build | `tsc` → `dist/` |
| Config | `dotenv` |

---

## Setup

```bash
# Install dependencies
npm install

# Configure API key
cp .env.example .env
# Add your CRYPTOPANIC_API_KEY to .env

# Build
npm run build

# Run
npm start
```

### Output

```json
{
  "timestamp": "2026-06-10T08:00:00.000Z",
  "source_scores": {
    "cryptopanic": { "score": 0.32, "confidence": 0.84, "source": "CryptoPanicSentimentAnalyzer" },
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

| Variable | Required | Description |
|---|---|---|
| `CRYPTOPANIC_API_KEY` | Yes | CryptoPanic API token |

---

## Project Structure

```
src/
├── index.ts                    # Entry point & orchestrator
├── fetchers/
│   ├── CryptoPanicFetcher.ts   # CryptoPanic API client
│   └── FearAndGreedFetcher.ts  # Alternative.me API client
├── analyzers/
│   ├── BaseAnalyzer.ts         # Abstract base
│   ├── SentimentAnalyzer.ts    # Text + vote scoring
│   └── FearAndGreedAnalyzer.ts # Index normalization
└── types/
    └── index.ts                # Shared TypeScript types
output/
└── latest.json                 # Latest signal result
docs/
└── index.html                  # GitHub Pages dashboard
```
