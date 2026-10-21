# Vid30 — Sprint History

> **Project:** Vid30 — AI Streaming Operating System  
> **Hackathon:** Amazon App Dev 2026  
> **Team:** John ([@Johnnadal](https://github.com/Johnnadal))  
> **Stack:** React Native TV · Expo · AWS Lambda · Amazon Bedrock Nova Lite · Vite/React web MVP

---

## Overview

Vid30 is an AI-powered streaming OS that lets users discover films using natural language. Built across 4 sprints during a hackathon, it targets **Fire TV (Vega OS)**, **Android TV**, **Apple TV**, and **web** from a single monorepo.

```
Sprint 1 — Foundation          React Native TV multi-platform base
Sprint 2 — AI & AWS            Bedrock Nova Lite + Lambda + /discover API
Sprint 3 — AI Streaming Intel  Intent model, Family Mode, Web MVP
Sprint 4 — Demo Ready          Film artwork, video playback, CORS fix
```

---

## Sprint 1 — Foundation
**Branch:** `sprint-1-Foundation`  
**Key commits:** `a6e7984`, `7b8b57f`, `a6407b2`

### What was built
- Forked and personalized the Amazon multi-TV starter (React Native tvOS + expo-multi-tv + Vega OS)
- Established the monorepo structure: `apps/expo-multi-tv`, `apps/vega`, `packages/shared-ui`
- Wired shared-ui screens: **HomeScreen**, **DetailsScreen**, **PlayerScreen**, **ExploreScreen**
- Integrated `react-native-video` for native playback (Android TV, Fire TV, Apple TV)
- Implemented `react-tv-space-navigation` for D-pad focus management
- Set up remote control handling per platform (`.android.ts`, `.ios.ts`, `.kepler.ts`)
- Configured VideoPlayer with overlay controls (play/pause, seek ±10s, progress bar)
- Connected to external catalog (`scrap-tv-feed/catalog.json`) via `fetchMoviesData()`
- Navigation stack: `DrawerNavigator → Home/Explore/TV/Settings → Details → Player`

### Technical decisions
- Platform-specific files resolved by Metro bundler at build time
- Vega OS uses Amazon's navigation/gesture/media packages (`@amazon-devices/*`)
- Shared `RootStackParamList` types across all platforms via `packages/shared-ui/src/navigation/types.ts`

---

## Sprint 2 — AI & AWS
**Branch:** `sprint-2-ai-aws`  
**Key commits:** `7e65ab7`, `d37114f`, `5ba0aeb`, `cc8e08f`

### What was built
- **DiscoveryService** (`apps/api/src/discovery/`): orchestrates AI intent extraction + catalog matching
- **BedrockProvider**: calls Amazon Nova Lite (`eu.amazon.nova-lite-v1:0`, region `eu-west-3`) to parse natural-language queries into structured intents
- **RuleBasedAIProvider**: deterministic fallback for local development (no AWS credentials needed)
- **`POST /discover` API**: deployed on AWS Lambda + API Gateway
  - Input: `{ query: string, familyMode?: boolean }`
  - Output: `{ intent: DiscoveryIntent, results: CatalogItem[] }`
- **Intent model** (v1): `mood`, `cinematic`, `maxDurationMinutes`, `genres`, `keywords`
- **Catalog expanded** to 24 films with `contentRating`, `familySafe`, metadata
- **ExploreScreen** on TV wired to the live API via `discoverContent()`
- **8 unit tests** covering intent extraction, catalog filtering, edge cases

### Architecture
```
Browser/TV → API Gateway → Lambda (eu-west-3)
                               ↓
                    BedrockProvider (Nova Lite)
                               ↓
                    DiscoveryService + MockCatalogProvider
```

---

## Sprint 3 — AI Streaming Intelligence
**Branch:** `sprint-3`  
**Key commits:** `cadcdf8`, `057d6f6`, `ff5ed75`, `46409b0`

### What was built
- **Extended intent model**: added `watchingContext` (`solo/couple/family/friends`) extracted by AI — discovery hint only, not a safety signal
- **Multi-criteria scoring engine**:
  - Hard filters first: duration cap + Family Mode (deterministic, metadata-based)
  - Scoring: mood (+5), cinematic (+3), genre (+3), keywords (+1), watchingContext affinity (+2)
  - Tie-break: shortest film first
- **Family Mode policy**: `familySafe = contentRating ∈ {G, PG, PG-13}` — computed at catalog creation, never AI-inferred
- **RuleBasedAIProvider improved**: French language support, Blade Runner → sci-fi+thriller inference, duration regex bug fixed
- **Nova Lite prompt updated** with `watchingContext` field definitions and examples
- **Web MVP launched** (`apps/web`): Vite 6 + React 18, zero React Native deps
  - Natural language input + 8 suggestion chips
  - Family Mode toggle with visual state
  - IntentPanel showing AI understanding
  - Film cards with contentRating badges
  - Detail modal overlay
- **Catalog expanded** to 41 films including **14 Vid30 Originals** (founder films)
- **ExploreScreen** updated: Family Mode toggle navigable by D-pad, re-triggers query
- **Vega navigation types** corrected (params mismatch with shared-ui fixed)
- **32/32 tests** ✅

### Key design choices
- `familyMode` is always client-side — the AI never controls safety filtering
- `watchingContext` improves ranking but cannot expose unsafe content
- Web MVP uses same `/discover` API as TV apps — single source of truth

---

## Sprint 4 — Demo Ready
**Branches:** `sprint-4-player` → `sprint-4-demo`  
**Key commits:** `66aa10e`, `2bf44e3`, `4faaf84`

### What was built

#### Sprint 4 — Player (branch: `sprint-4-player`)

**Film artwork integration:**
- Located 18 real JPG images in `images/` folder (film1–9 + hero variants)
- Mapped to catalog via `aiVideos/README.md`: film1=ai-directors-commercial, film2=adidas-creative … film9=archives-paris-1900
- Copied to `apps/web/public/images/` for Vite static serving
- Added `imageUrl` (600×338 thumbnail) and `heroUrl` (1920×1080 banner) to `CatalogItem` and API types
- 9 of 14 Vid30 Originals now have real artwork; 5 show a fallback gradient

**Video playback integration:**
- Discovered real MP4 files in `aiVideos/` (film1–9, 1.4–15.7 MB, valid `ftypisom` headers)
- Copied to `apps/web/public/videos/` with correct catalog ID filenames
- Added `videoUrl` to all 14 Vid30 Originals in `mockCatalog.ts`
- Web MVP `PlayerScreen`: HTML5 `<video>` with native controls, poster image, autoPlay, onEnded callback
- Play button appears only for founder films with a valid `videoUrl`
- "Video not available" fallback for the 5 films without source files

**UI changes:**
- `ResultCard`: thumbnail on the left for founder films, fallback 🎬 icon
- `DetailPanel`: hero banner at top (1920×1080 with gradient overlay)
- `PlayerScreen`: fullscreen, close button (✕), film info below video

#### Sprint 4 — Demo (branch: `sprint-4-demo`)

**Root cause diagnosed and fixed:**

Two bugs prevented video playback in the browser:

1. **Lambda prod missing `videoUrl`** — the deployed Lambda was from Sprint 3 (before catalog enrichment). Queries hitting the production API returned films without `videoUrl`, so the Play button never appeared.

2. **CORS preflight blocked** — the local Fastify dev server (`yarn dev`, port 3000) returned 404 on all `OPTIONS` requests. The browser silently blocked every cross-origin request from Vite (5173) to the API (3000). Discovery itself was broken.

**Fixes:**
- `apps/api/src/index.ts`: added `onRequest` CORS hook — `OPTIONS → 204`, `Access-Control-Allow-Origin: *`
- `apps/web/.env.local`: `VITE_API_URL=http://localhost:3000` (gitignored, local-only)
- Both servers now work together correctly

### Current state
- **9 films fully playable** with real video, poster, and artwork
- **5 films** show "Video not available" (no source file — clean fallback)
- **41/41 tests** ✅ throughout all sprints
- Family Mode preserved and functional

---

## Technical Stack Summary

| Layer | Technology |
|---|---|
| TV apps | React Native tvOS 0.81, Expo SDK 54 |
| Fire TV Vega OS | Amazon Vega SDK, `@amazon-devices/*` packages |
| Shared UI | `packages/shared-ui` — screens, navigation, player |
| Video playback (TV) | `react-native-video` v6 |
| Video playback (web) | HTML5 `<video>` element |
| AI discovery | Amazon Bedrock Nova Lite (`eu.amazon.nova-lite-v1:0`) |
| API runtime | AWS Lambda + API Gateway, region `eu-west-3` |
| Local dev API | Fastify + tsx watch |
| Web MVP | Vite 6 + React 18 + TypeScript 5 |
| Spatial navigation | `react-tv-space-navigation` v6 |
| Tests | Vitest, 41 tests |
| Monorepo | Yarn 4 workspaces |

---

## Repository Structure

```
vid30-ai-streaming-os/
├── apps/
│   ├── api/          Local dev server (Fastify) + catalog + AI providers
│   ├── expo-multi-tv Universal TV app (Android TV, Apple TV, Fire TV, Web)
│   ├── lambda/       AWS Lambda handler (imports from apps/api)
│   ├── vega/         Fire TV Vega OS app (Amazon Kepler SDK)
│   └── web/          Web MVP (Vite + React — hackathon demo)
├── packages/
│   └── shared-ui/    Screens, components, navigation, discovery service
├── images/           Original film artwork (film1–9 JPG + hero variants)
├── aiVideos/         Original video files (film1–9 MP4, no extension)
└── SPRINT-HISTORY.md This document
```
