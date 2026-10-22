# Vid30 an AI Streaming Operating System

> **Amazon App Dev Hackathon 2026**  
> Natural language film discovery and video playback for Smart TV, Fire TV, and web.

[![License: MIT-0](https://img.shields.io/badge/License-MIT--0-yellow.svg)](./LICENSE)
[![Tests](https://img.shields.io/badge/tests-41%2F41-brightgreen)](./apps/api/src/discover.test.ts)
[![Platform](https://img.shields.io/badge/platform-Fire%20TV%20%7C%20Android%20TV%20%7C%20Web-blue)](./apps/web)

---

## Demo Video

[![Vid30 Demo — AI Film Discovery & Playback on Fire TV](https://img.youtube.com/vi/hYhjoYZBDRY/maxresdefault.jpg)](https://youtu.be/hYhjoYZBDRY)

---

## What is Vid30?

Vid30 is a streaming intelligence layer built on top of a React Native multi-TV starter. Users describe what they want to watch in plain language and the system uses **Amazon Bedrock Nova Lite** to extract structured intent, score catalog films, and return ranked results.

**"Something dark and cinematic under 90 minutes"** → AI extracts mood, duration cap, cinematic flag → scores 41 catalog films → returns ranked matches with content ratings.

The same discovery engine runs on **Fire TV (Vega OS)**, **Android TV**, **Apple TV**, and a **web browser** from a single monorepo.

---

## Features

All features listed here are confirmed by the codebase and test suite.

### AI Discovery
- Natural language query parsing via **Amazon Bedrock Nova Lite** (`eu.amazon.nova-lite-v1:0`, region `eu-west-3`)
- Structured intent extraction: `mood`, `cinematic`, `maxDurationMinutes`, `genres`, `keywords`, `watchingContext`
- Multi-criteria scoring: hard filters first (duration, Family Mode), then relevance score
- Multilingual support — French queries work with the rule-based fallback provider
- Deterministic fallback (`RuleBasedAIProvider`) for local development without AWS credentials

### Family Mode
- One-toggle filter: restricts results to `contentRating ∈ {G, PG, PG-13}`
- Deterministic — computed at catalog creation, never AI-inferred
- Instantly re-runs the current query on toggle change

### Film Catalog
- **41 films** with `contentRating`, `familySafe`, `genres`, `mood`, `durationMinutes`
- **14 Vid30 Originals** — founder films with `imageUrl` (600×338), `heroUrl` (1920×1080), and `videoUrl`
- **9 Vid30 Originals** have real MP4 source files served from `apps/web/public/videos/`
- **5 Vid30 Originals** display a "Video not available" fallback (no source file)

### Web MVP (`apps/web`)
- Natural language input with 8 suggestion chips
- Intent panel showing what the AI understood
- Film cards with artwork thumbnails for Vid30 Originals
- Detail panel with hero banner image
- HTML5 video player with native controls, poster image, autoPlay
- **▶ Play** button appears only for films with a real `videoUrl`
- Family Mode toggle with visual ON/OFF state
- Error, loading, and empty-state handling

### TV Apps
- `apps/expo-multi-tv` — React Native, targets Android TV, Apple TV, Fire TV FOS, and Expo web
- `apps/vega` — Fire TV Vega OS build using Amazon Kepler SDK
- Shared screens: `HomeScreen`, `DetailsScreen`, `PlayerScreen`, `ExploreScreen`
- D-pad navigation via `react-tv-space-navigation`
- `react-native-video` v6 for native playback on TV devices

> **Note:** The TV apps build and compile cleanly. Runtime validation on a physical Fire TV Vega OS device has not been completed — see [Roadmap](#roadmap).

---

## Architecture

```
┌────────────────────────────────────────────────────────────────┐
│  Client apps                                                   │
│  ┌─────────────┐  ┌──────────────────┐  ┌────────────────┐   │
│  │  apps/web   │  │ apps/expo-multi- │  │   apps/vega    │   │
│  │ Vite+React  │  │  tv (RN/Expo)   │  │  (Kepler SDK)  │   │
│  └──────┬──────┘  └────────┬─────────┘  └───────┬────────┘   │
│         └─────────────────┼────────────────────┘             │
│                           │  POST /discover                   │
├───────────────────────────┼───────────────────────────────────┤
│  API layer                │                                   │
│  ┌───────────────────┐    │    ┌──────────────────────────┐   │
│  │  apps/api         │◄───┘    │  apps/lambda             │   │
│  │  Fastify (local)  │         │  AWS Lambda + API GW     │   │
│  │  port 3000        │         │  eu-west-3 (deployed)    │   │
│  └─────────┬─────────┘         └────────────┬─────────────┘   │
│            └──────────────────────────────┐ │                 │
├───────────────────────────────────────────┼─┼─────────────────┤
│  AI layer                                 │ │                 │
│                            ┌──────────────▼─▼──────────────┐  │
│                            │  Amazon Bedrock Nova Lite      │  │
│                            │  eu.amazon.nova-lite-v1:0     │  │
│                            │  region: eu-west-3            │  │
│                            └───────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

**Deployed services:**
- AWS Lambda function `vid30-discovery` — eu-west-3
- API Gateway HTTP API: `https://jows41bdb5.execute-api.eu-west-3.amazonaws.com/prod`
- Amazon Bedrock Nova Lite — invoked by the Lambda on every `/discover` call

**Local-only services:**
- Fastify dev server (`apps/api`) — runs on `http://localhost:3000`
- Vite dev server (`apps/web`) — runs on `http://localhost:5173`

> The deployed Lambda is from Sprint 3 and does not yet include `videoUrl` fields.  
> To see full artwork and video playback, use the local Fastify server (instructions below).

---

## Local Setup & Launch

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | v18 or higher |
| Yarn | v4.5.0 (`npm install -g yarn`) |
| AWS credentials | Optional — only needed for Bedrock (see below) |

### 1. Clone and install

```bash
git clone https://github.com/Johnnadal/vid30-ai-streaming-os.git
cd vid30-ai-streaming-os
yarn install
```

### 2. Configure environment

```bash
# Copy the example file — fill in your AWS credentials if you want Bedrock
cp .env.example apps/api/.env
```

Key variables in `.env.example`:

```bash
AWS_REGION=eu-west-3
BEDROCK_MODEL_ID=eu.amazon.nova-lite-v1:0
AI_PROVIDER=bedrock      # or "rule-based" for local dev without AWS
PORT=3000
```

> **No AWS credentials?** Set `AI_PROVIDER=rule-based` in `apps/api/.env` — the deterministic fallback works offline.

Then point the web app at the local server:

```bash
# Create apps/web/.env.local  (gitignored — never committed)
echo "VITE_API_URL=http://localhost:3000" > apps/web/.env.local
```

### 3. Start the API server

```bash
cd apps/api
yarn dev
# Fastify starts on http://localhost:3000
# tsx watch — auto-restarts on file changes
```

Verify it's up:
```bash
curl http://localhost:3000/health
# → {"status":"ok"}
```

### 4. Start the web app

Open a second terminal:

```bash
cd apps/web
yarn dev
# Vite starts on http://localhost:5173 (opens automatically)
```

### 5. Try the demo

Open **http://localhost:5173** and try these queries:

| Query | What to observe |
|---|---|
| `Something dark and cinematic under 90 minutes` | Mood + duration + cinematic flag extracted |
| `A funny comedy for a family movie night` | Family context detected, comedy affinity boost |
| `Soirée cinéma en famille` | French query works |
| `Something like Blade Runner but shorter` | Reference inference → sci-fi + thriller |

**Playback flow:**
1. Search → film cards appear, Vid30 Originals show artwork thumbnails
2. Click a card with the 🎬 badge → detail panel with hero banner
3. Click **▶ Play** → fullscreen HTML5 player
4. Press **✕** → back to results

---

## API Reference

### `POST /discover`

**Request:**
```json
{
  "query": "Something dark and cinematic under 90 minutes",
  "familyMode": false
}
```

**Response:**
```json
{
  "intent": {
    "mood": "dark",
    "cinematic": true,
    "maxDurationMinutes": 90,
    "genres": [],
    "keywords": ["dark", "cinematic"],
    "watchingContext": null,
    "familyMode": false
  },
  "results": [
    {
      "id": "vid30-signal-lost",
      "title": "Signal Lost",
      "durationMinutes": 28,
      "contentRating": "PG-13",
      "familySafe": true,
      "origin": "founder",
      "videoUrl": "/videos/vid30-signal-lost.mp4",
      "imageUrl": "/images/film4.jpg",
      "heroUrl": "/images/film4-hero.jpg"
    }
  ]
}
```

### `GET /health`

```json
{ "status": "ok" }
```

**Production endpoint:** `https://jows41bdb5.execute-api.eu-west-3.amazonaws.com/prod`

---

## Run Tests

```bash
cd apps/api
yarn test
# 41/41 tests pass (Vitest)
```

Tests cover: intent extraction, catalog filtering, Family Mode policy, duration parsing, `watchingContext` affinities, and scoring edge cases.

---

## Project Structure

```
vid30-ai-streaming-os/
├── apps/
│   ├── api/              Local Fastify dev server — catalog, AI providers, /discover
│   ├── expo-multi-tv/    Universal TV app — Android TV, Apple TV, Fire TV FOS, Expo web
│   ├── lambda/           AWS Lambda handler (imports from apps/api)
│   ├── vega/             Fire TV Vega OS app — Amazon Kepler SDK
│   └── web/              Web MVP — Vite + React (hackathon demo)
├── packages/
│   └── shared-ui/        Shared screens, navigation, player, discovery service
├── images/               Film artwork originals (film1–9 JPG + hero variants)
├── aiVideos/             Film source files (film1–9, no extension — valid MP4)
├── README.md             This document
├── README-AMAZON-ORIGINAL.md  Original Amazon starter README (preserved)
├── HACKATHON-README.md   Jury quickstart guide
├── SPRINT-HISTORY.md     Technical history — Sprints 1 to 4
└── SPRINT3.md / SPRINT3-EN.md  Sprint 3 CTO brief (FR + EN)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| AI | Amazon Bedrock Nova Lite `eu.amazon.nova-lite-v1:0` |
| Backend | AWS Lambda + API Gateway, region `eu-west-3` |
| Local dev server | Fastify 5 + tsx watch |
| TV apps | React Native tvOS 0.81, Expo SDK 54 |
| Fire TV Vega OS | Amazon Vega SDK + `@amazon-devices/*` packages |
| Web MVP | Vite 6 + React 18 + TypeScript 5 |
| Shared UI | `packages/shared-ui` — screens, navigation, player components |
| Video (TV) | `react-native-video` v6 |
| Video (web) | HTML5 `<video>` element |
| TV navigation | `react-tv-space-navigation` v6 |
| Tests | Vitest — 41 tests |
| Monorepo | Yarn 4 workspaces |
| Schema validation | Zod v4 |

---

## Roadmap

Items marked ✅ are confirmed working. Items marked 🔲 are planned or pending validation.

| Item | Status |
|---|---|
| AI natural language discovery (`/discover`) | ✅ Deployed and tested |
| Family Mode filter | ✅ Web + TV (ExploreScreen) |
| Web MVP — search, intent panel, results | ✅ Verified in browser |
| Web MVP — film detail with hero image | ✅ Verified in browser |
| Web MVP — HTML5 video playback (9 films) | ✅ Verified in browser |
| 41-film catalog with content ratings | ✅ Tested (41/41) |
| expo-multi-tv — ExploreScreen wired to API | ✅ Code complete |
| Vega OS — TypeScript + navigation types | ✅ Corrected Sprint 3 |
| Fire TV Vega OS — runtime validation | 🔲 Requires Vega SDK device |
| expo-multi-tv — runtime on Android TV device | 🔲 Not validated on device |
| Lambda — update with Sprint 4 catalog fields | 🔲 `videoUrl`/`imageUrl` missing in prod |
| BYOK (bring-your-own-key AI provider) | 🔲 UI placeholder only |
| Watchlist / viewing history | 🔲 Not built |
| CDN / HLS streaming for longer films | 🔲 Not built |
| Pagination of discovery results | 🔲 Not built |

---

## TV App Launch

```bash
# Android TV / Fire TV FOS — requires Android Studio + adb device connected
cd apps/expo-multi-tv
yarn android

# Apple TV — requires macOS + Xcode
yarn ios

# Expo web (browser, no TV device)
yarn web

# Fire TV Vega OS — requires Vega SDK + $KEPLER_SDK_HOME configured
cd apps/vega
yarn build:debug
```

---

## Credits & Acknowledgements

Vid30 is built on top of the **[React Native Multi-TV App Sample](https://github.com/AmazonAppDev/react-native-multi-tv-app-sample)** by Amazon App Dev, which provided the cross-platform TV foundation (expo-multi-tv, vega, shared-ui, spatial navigation, video player).

The original starter README and credits are preserved in [README-AMAZON-ORIGINAL.md](./README-AMAZON-ORIGINAL.md).

> Licensed under [MIT-0](./LICENSE) — see license file for details.  
> Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

---

## Related Documents

| Document | Description |
|---|---|
| [`HACKATHON-README.md`](./HACKATHON-README.md) | Condensed jury quickstart guide |
| [`SPRINT-HISTORY.md`](./SPRINT-HISTORY.md) | Full technical history, Sprints 1–4 |
| [`SPRINT3-EN.md`](./SPRINT3-EN.md) | Sprint 3 CTO brief (English) |
| [`SPRINT3.md`](./SPRINT3.md) | Sprint 3 CTO brief (French original) |
| [`README-AMAZON-ORIGINAL.md`](./README-AMAZON-ORIGINAL.md) | Original Amazon starter README |

---

*Vid30 — Built for Amazon App Dev Hackathon 2026*
