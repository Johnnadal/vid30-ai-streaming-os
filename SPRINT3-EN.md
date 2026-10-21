# Sprint 3 — AI Streaming Intelligence

> **Status:** Delivered — Hackathon 26, Vid30 MVP  
> **Branch:** `sprint-3`  
> **Date:** October 2026

---

## What Was Delivered

### 1. Extended Intent Model (`apps/api/src/ai/types.ts`)

The `DiscoveryIntentSchema` (Zod) was enriched with new fields:

| Field | Type | Source | Description |
|---|---|---|---|
| `mood` | `string \| null` | AI | Emotional tone (dark / funny / romantic / mysterious) |
| `cinematic` | `boolean` | AI | Epic / cinematic visual style |
| `maxDurationMinutes` | `number \| null` | AI | Strict maximum duration |
| `genres` | `string[]` | AI | Catalog genres |
| `keywords` | `string[]` | AI | Descriptors extracted from the query |
| `watchingContext` | `"solo"\|"couple"\|"family"\|"friends"\|null` | AI | Social viewing context |
| `familyMode` | `boolean` | **Client** | Family safety filter — never extracted by AI |

> **Important:** `watchingContext` is a discovery hint, not a safety signal. `familyMode` is the only safety switch and is passed by the client.

---

### 2. Multi-Criteria Filtering (`apps/api/src/catalog/MockCatalogProvider.ts`)

**Hard filters (applied first, cannot be overridden):**
- Maximum duration (`maxDurationMinutes`)
- Family Mode: excludes any item where `familySafe !== true`

**Scoring (applied to remaining items):**

| Signal | Points |
|---|---|
| Mood match | +5 |
| Cinematic | +3 |
| Genre match | +3 per genre |
| Keyword overlap (title + description) | +1 per keyword |
| watchingContext genre affinity | +2 if genre is affinity-matched |

Tie-break: shortest film first. Score = 0 → excluded.

**watchingContext affinities:**
- `family` → comedy, drama, action
- `couple` → romance, drama
- `friends` → action, comedy, thriller, sci-fi
- `solo` → drama, sci-fi, noir, thriller, horror

---

### 3. Family Mode — Conservative Policy

- `familySafe = true` if and only if `contentRating ∈ {G, PG, PG-13}`
- `familySafe = false` for `R` and for any item without a known `contentRating`
- The decision is **deterministic based on metadata** — never an AI inference
- The system **does not certify** that content is appropriate for children

---

### 4. Improved RuleBasedAIProvider

- French support: `sombre` → dark, `cinématographique` → cinematic, `de moins de` → duration
- `watchingContext` extraction: family / couple / friends / solo
- Enriched genres: comedy, action, romance, mystery, noir + reference inference (Blade Runner → sci-fi + thriller)
- Bug fixed: duration regex — `isHours` matched `h` inside `watch` → capture group corrected

---

### 5. BedrockProvider — Updated Nova Lite Prompt

The system prompt includes `watchingContext` in the field definitions with concrete examples. Nova Lite extracts 6 fields; `familyMode` is injected post-parsing by `DiscoveryService`.

---

### 6. Tests: 32/32 ✅ (`apps/api`)

**Sprint 2 tests preserved (17 tests):**
- Intent extraction (3), catalog results (4), edge cases (1)
- Family Mode strict filter (5), backwards compatibility (2), catalog metadata (2)

**Sprint 3 new tests (15 tests):**
- `watchingContext` extraction (6) — family / couple / friends / solo / null / field present
- Reference scenarios (4) — French query, Blade Runner, family night, combined
- Keyword scoring (3) — space/signal boost, friends affinity, couple affinity
- Duration parsing (2) — "under 2 hours" → 120, "less than 90 minutes" → 90

---

### 7. Web MVP (`apps/web`)

**Stack:** Vite 6 + React 18 + TypeScript 5 (zero React Native dependencies)  
**Bundle:** 151 kB JS gzipped 48 kB, 6.9 kB CSS — build in 1.5s

**Full user journey:**
1. Natural language input (text field + 8 suggestion chips)
2. Family Mode toggle with ON/OFF visual state
3. Real API Gateway call (or local via `VITE_API_URL`)
4. IntentPanel: what the system understood (mood, cinematic, duration, genres, keywords, watchingContext, familyMode)
5. Results list with colored contentRating badges (G/PG/PG-13/R)
6. Film detail view (click → modal overlay)
7. States: loading, error, empty results with contextual message

**Launch:**
```bash
# Production API (default)
yarn dev:web-mvp

# Local server (API on port 3000)
VITE_API_URL=http://localhost:3000 yarn dev:web-mvp

# Production build
yarn build:web-mvp
```

---

### 8. TV ExploreScreen (`packages/shared-ui/src/screens/ExploreScreen.tsx`)

- D-pad navigable Family Mode toggle (`SpatialNavigationFocusableView`)
- Visual ON/OFF indicator (toggle track + knob)
- Re-triggers current query when toggle changes
- `IntentSummary`: displays what the system understood after each query
- Navigation to `DetailsScreen` with full params (title, description, headerImage, movie, genres, contentRating, duration)
- `discoverContent` updated to `DiscoverRequest` signature

---

### 9. Vega Navigation (`apps/vega/src/navigation/types.ts`)

**Bug fixed:** Local Vega `RootStackParamList` defined:
- `Details: { itemId: string }` → incompatible with shared-ui `DetailsScreen`
- `Player: { videoId: string }` → incompatible with shared-ui `PlayerScreen`

**Fix:** Redefined with full params mirroring shared-ui. Root screen `Main` preserved (Vega-specific — different from shared-ui's `DrawerNavigator`).

---

## Vega OS Validation State

> This section explicitly distinguishes what was verified from what was not.

| Step | Status | Notes |
|---|---|---|
| TypeScript compilation (`tsc --noEmit`) | ⚠️ Pre-existing errors | 206 errors in shared-ui and vega — all pre-date Sprint 3. Caused by missing RN/Kepler/navigation types in the isolated typecheck environment. No new errors introduced. |
| Vega release build (`react-native build-kepler`) | ❌ Not executed | Requires Vega SDK installed (`$KEPLER_SDK_HOME`). Not available in the current dev environment. |
| APK/Kepler bundle generation | ❌ Not executed | Depends on the release build. |
| Fire TV Vega OS simulator launch | ❌ Not executed | Requires Kepler simulator or physical Fire TV Vega OS device. |
| Full app journey validation | ❌ Not executed | To be validated manually on simulator or device. |

**To validate Vega locally:**
```bash
# Prerequisite: Vega SDK installed, $KEPLER_SDK_HOME configured
cd apps/vega
yarn build:debug    # Debug build
yarn build:release  # Release build
```

---

## API Contracts

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
      "id": "neon-rain",
      "title": "Neon Rain",
      "description": "...",
      "durationMinutes": 82,
      "genres": ["sci-fi", "thriller"],
      "mood": ["dark", "mysterious"],
      "cinematic": true,
      "contentRating": "PG-13",
      "familySafe": true
    }
  ]
}
```

**Backwards compatibility:** `familyMode` is optional, defaults to `false`. Sprint 2 clients continue to work without modification.

### `GET /health`
```json
{ "status": "ok" }
```

**Infrastructure:** unchanged. Same Lambda `vid30-discovery`, same API Gateway, same region `eu-west-3`, same model `eu.amazon.nova-lite-v1:0`.

---

## Known Limitations and Deferred Work

### Technical Limitations
- **Catalog images:** films do not have poster URLs — ExploreScreen uses a generic Unsplash image for navigation to DetailsScreen
- **watchingContext in production:** Nova Lite extracts `watchingContext` but the Zod schema is strict — if Nova Lite returns an unexpected value, it defaults to `null`
- **RuleBasedAIProvider:** French support is limited to a few keywords (`sombre`, `cinématographique`, `de moins de`) — Bedrock handles multilingual correctly in production
- **Catalog:** 24 demo films, not updated since Sprint 2

### Deferred Work
- **Film posters:** add image URLs per item in `mockCatalog.ts`
- **Results pagination:** the API response returns up to 24 films without pagination
- **Vega runtime validation:** to be executed when Vega SDK is available
- **E2E tests:** coverage for real network calls (currently mocked via rule-based provider)
- **Dynamic catalog:** replace MockCatalogProvider with an external source

---

## Modified Files — Sprint 3

```
apps/api/src/ai/types.ts                    ← watchingContext in DiscoveryIntentSchema
apps/api/src/ai/RuleBasedAIProvider.ts      ← extended extraction + duration bug fix
apps/api/src/ai/BedrockProvider.ts          ← updated Nova Lite prompt
apps/api/src/catalog/MockCatalogProvider.ts ← keyword scoring + watchingContext affinity
apps/api/src/discover.test.ts               ← 32 tests (Sprint 2 + 15 new)

apps/web/                                   ← Web MVP (new)
  package.json, tsconfig.json, vite.config.ts, index.html
  src/main.tsx, src/api.ts, src/App.tsx, src/styles.css

apps/vega/src/navigation/types.ts           ← RootStackParamList corrected
apps/vega/src/navigation/VegaRootNavigator.tsx ← alignment comment

packages/shared-ui/src/data/discoverService.ts  ← extended types (watchingContext, contentRating, familySafe)
packages/shared-ui/src/screens/ExploreScreen.tsx ← Family Mode toggle + IntentSummary + Details nav

.kiro/specs/sprint-3/requirements.md        ← Sprint 3 spec (REQ-1 to REQ-7)
package.json                                ← scripts dev:web-mvp, build:web-mvp
SPRINT3.md                                  ← original French document
SPRINT3-EN.md                               ← this document (English translation)
```
