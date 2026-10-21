# Vid30 — AI Streaming Operating System
### Amazon App Dev Hackathon 2026

> **What is Vid30?** An AI-powered streaming OS that lets users discover films in natural language — *"something dark and cinematic under 90 minutes for a solo evening"* — and play them instantly.  
> Runs on **Fire TV (Vega OS)**, **Android TV**, **Apple TV**, and **web browser** from a single codebase.

---

## Quickstart — Web Demo (5 minutes)

The fastest way to see the full experience. No device required.

### Prerequisites

- Node.js v18+
- Yarn v4 (`npm install -g yarn`)

### Step 1 — Install

```bash
git clone https://github.com/Johnnadal/vid30-ai-streaming-os.git
cd vid30-ai-streaming-os
yarn install
```

### Step 2 — Configure local API

Create this file (it tells the web app to use the local server with full catalog data):

```bash
# Create apps/web/.env.local
echo "VITE_API_URL=http://localhost:3000" > apps/web/.env.local
```

### Step 3 — Launch (two terminals)

```bash
# Terminal 1 — API server (catalog + AI)
cd apps/api
yarn dev
# Starts on http://localhost:3000
```

```bash
# Terminal 2 — Web app
cd apps/web
yarn dev
# Opens http://localhost:5173 automatically
```

### Step 4 — Try it

Open **http://localhost:5173** in your browser.

**Suggested queries to demo:**
| Query | What to observe |
|---|---|
| `Something dark and cinematic under 90 minutes` | AI extracts mood, cinematic flag, duration cap — results ranked by score |
| `A funny light comedy for the weekend with friends` | watchingContext=friends, comedy affinity boost |
| `Soirée cinéma en famille` | French query works, Family Mode hint detected |
| `Something like Blade Runner but shorter` | Blade Runner → sci-fi + thriller inference |

**Full playback flow:**
1. Search → see film cards with artwork
2. Click a **Vid30 Original** (purple 🎬 badge)
3. Detail panel opens with hero banner image
4. Click **▶ Play** → fullscreen HTML5 player starts
5. Press **✕** → back to results

---

## What the AI Does

Every query goes through this pipeline:

```
Natural language query
        ↓
Amazon Bedrock Nova Lite (eu-west-3)
        ↓
Structured intent: mood + cinematic + duration + genres + keywords + watchingContext
        ↓
Multi-criteria scoring engine (hard filters first, then relevance score)
        ↓
Ranked results with contentRating badges
```

The AI never controls safety filtering. **Family Mode** is a deterministic client-side flag that filters by `contentRating ∈ {G, PG, PG-13}`.

---

## Catalog

- **41 films total** — mix of catalog titles and Vid30 Originals
- **14 Vid30 Originals** — founder films with real artwork and video
- **9 films fully playable** with real MP4 source and poster/hero images
- **5 films** show a clean "Video not available" fallback

Content ratings: G, PG, PG-13, R — demo classifications, not official certifications.

---

## Family Mode

Toggle it in the UI — it instantly re-runs the current query and filters to G/PG/PG-13 only. No AI involved. Works on web and TV apps.

---

## Architecture at a Glance

```
┌─────────────────────────────────────────────────────────┐
│  apps/web       Vite + React — hackathon demo           │
│  apps/expo-multi-tv  React Native (Android/Apple/FireTV)│
│  apps/vega      Fire TV Vega OS (Amazon Kepler SDK)     │
├─────────────────────────────────────────────────────────┤
│  packages/shared-ui  Shared screens, player, navigation │
├─────────────────────────────────────────────────────────┤
│  apps/api       Local Fastify dev server                │
│  apps/lambda    AWS Lambda handler → API Gateway        │
└─────────────────────────────────────────────────────────┘
         ↕ POST /discover
  Amazon Bedrock Nova Lite (eu-west-3)
```

The same `/discover` endpoint is used by all clients. The Lambda is deployed at:  
`https://jows41bdb5.execute-api.eu-west-3.amazonaws.com/prod`

> **Note for the jury:** The production Lambda is from Sprint 3 and does not yet include `videoUrl` fields. Use the local dev server (Step 2–3 above) to see full artwork and playback.

---

## Alternative Launch — Production API (no local server)

If you just want to test AI discovery without video playback:

```bash
cd apps/web
yarn dev
# Opens http://localhost:5173
# Uses production Lambda automatically (no .env.local needed)
# Discovery and intent panel work — Play buttons won't appear (Sprint 3 Lambda)
```

---

## TV App — Fire TV / Android TV

```bash
# Android TV / Fire TV FOS
cd apps/expo-multi-tv
yarn android

# Apple TV
yarn ios

# Fire TV Vega OS (requires Vega SDK + $KEPLER_SDK_HOME)
cd apps/vega
yarn build:debug
```

---

## Run Tests

```bash
cd apps/api
yarn test
# → 41/41 tests pass
```

---

## Sprint History

See [`SPRINT-HISTORY.md`](./SPRINT-HISTORY.md) for the full technical history of each sprint.  
See [`SPRINT3-EN.md`](./SPRINT3-EN.md) for the detailed Sprint 3 CTO brief (English).

---

## Tech Stack

| | |
|---|---|
| **AI** | Amazon Bedrock Nova Lite (`eu.amazon.nova-lite-v1:0`) |
| **Backend** | AWS Lambda + API Gateway, region `eu-west-3` |
| **TV apps** | React Native tvOS 0.81, Expo SDK 54 |
| **Vega OS** | Amazon Vega SDK + `@amazon-devices/*` |
| **Web** | Vite 6 + React 18 + TypeScript 5 |
| **Video (TV)** | `react-native-video` v6 |
| **Video (web)** | HTML5 `<video>` element |
| **Navigation** | `react-tv-space-navigation` v6 |
| **Tests** | Vitest — 41 tests |
| **Monorepo** | Yarn 4 workspaces |

---

*Vid30 — Built for Amazon App Dev Hackathon 2026*
