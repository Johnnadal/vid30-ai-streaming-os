# Sprint 3 — AI Streaming Intelligence

> **Status :** Livré — Hackathon 26, Vid30 MVP  
> **Branche :** `sprint-3`  
> **Date :** Octobre 2026

---

## Ce qui a été livré

### 1. Modèle d'intention étendu (`apps/api/src/ai/types.ts`)

Le `DiscoveryIntentSchema` (Zod) est enrichi avec un nouveau champ :

| Champ | Type | Source | Description |
|---|---|---|---|
| `mood` | `string \| null` | IA | Tonalité émotionnelle (dark / funny / romantic / mysterious) |
| `cinematic` | `boolean` | IA | Style visuel épique / cinématographique |
| `maxDurationMinutes` | `number \| null` | IA | Durée maximale stricte |
| `genres` | `string[]` | IA | Genres du catalogue |
| `keywords` | `string[]` | IA | Descripteurs extraits de la requête |
| `watchingContext` | `"solo"\|"couple"\|"family"\|"friends"\|null` | IA | Contexte de visionnage social |
| `familyMode` | `boolean` | **Client** | Filtre de sécurité familiale — jamais extrait par l'IA |

> **Important :** `watchingContext` est un indice de découverte, pas un signal de sécurité. `familyMode` est le seul commutateur de sécurité, transmis par le client.

---

### 2. Filtrage multi-critères (`apps/api/src/catalog/MockCatalogProvider.ts`)

**Filtres stricts (inviolables, appliqués en premier) :**
- Durée maximale (`maxDurationMinutes`)
- Family Mode : exclut tout item avec `familySafe !== true`

**Scoring (sur les items restants) :**

| Signal | Points |
|---|---|
| Mood match | +5 |
| Cinematic | +3 |
| Genre match | +3 par genre |
| Keyword overlap (titre + description) | +1 par keyword |
| watchingContext genre affinity | +2 si genre affinitaire |

Tie-break : film le plus court en premier. Score = 0 → exclu.

**Affinités watchingContext :**
- `family` → comedy, drama, action
- `couple` → romance, drama
- `friends` → action, comedy, thriller, sci-fi
- `solo` → drama, sci-fi, noir, thriller, horror

---

### 3. Family Mode — politique conservatrice

- `familySafe = true` ssi `contentRating ∈ {G, PG, PG-13}`
- `familySafe = false` pour `R` et pour tout item sans `contentRating` connu
- La décision est **déterministe sur métadonnées** — jamais une inférence IA
- Le système **ne certifie pas** l'adéquation d'un contenu pour les enfants

---

### 4. RuleBasedAIProvider amélioré

- Support français : `sombre` → dark, `cinématographique` → cinematic, `de moins de` → duration
- Extraction `watchingContext` : family / couple / friends / solo
- Genres enrichis : comedy, action, romance, mystery, noir + inférence références (Blade Runner → sci-fi + thriller)
- Bug corrigé : regex duration — `isHours` matchait `h` dans `watch` → groupe capturé

---

### 5. BedrockProvider — prompt Nova Lite mis à jour

Le prompt système inclut `watchingContext` dans les field definitions avec des exemples concrets. Nova Lite extrait les 6 champs ; `familyMode` est injecté post-parsing par `DiscoveryService`.

---

### 6. Tests : 32/32 ✅ (`apps/api`)

**Tests Sprint 2 préservés (17 tests) :**
- Intent extraction (3), catalog results (4), edge cases (1)
- Family Mode strict filter (5), backwards compatibility (2), catalog metadata (2)

**Tests Sprint 3 ajoutés (15 tests) :**
- `watchingContext` extraction (6) — family / couple / friends / solo / null / field present
- Scénarios de référence (4) — requête française, Blade Runner, soirée famille, combiné
- Keyword scoring (3) — space/signal boost, friends affinity, couple affinity
- Duration parsing (2) — "under 2 hours" → 120, "less than 90 minutes" → 90

---

### 7. MVP Web (`apps/web`)

**Stack :** Vite 6 + React 18 + TypeScript 5 (aucune dépendance React Native)  
**Bundle :** 151 kB JS gzippé 48 kB, 6.9 kB CSS — build en 1.5s

**Parcours complet :**
1. Saisie en langage naturel (input + 8 suggestion chips)
2. Toggle Family Mode avec état visuel ON/OFF
3. Appel réel à l'API Gateway (ou local via `VITE_API_URL`)
4. IntentPanel : ce que le système a compris (mood, cinematic, durée, genres, keywords, watchingContext, familyMode)
5. Liste des résultats avec contentRating badge coloré (G/PG/PG-13/R)
6. Vue détail film (clic → overlay modal)
7. États : chargement, erreur, résultats vides avec message contextualisé

**Lancement :**
```bash
# Production API (par défaut)
yarn dev:web-mvp

# Serveur local (API sur port 3000)
VITE_API_URL=http://localhost:3000 yarn dev:web-mvp

# Build production
yarn build:web-mvp
```

---

### 8. TV ExploreScreen (`packages/shared-ui/src/screens/ExploreScreen.tsx`)

- Family Mode toggle navigable D-pad (`SpatialNavigationFocusableView`)
- Indicateur visuel ON/OFF (toggle track + knob)
- Re-déclenche la requête courante quand le toggle change
- `IntentSummary` : affiche ce que le système a compris après chaque requête
- Navigation vers `DetailsScreen` avec params complets (title, description, headerImage, movie, genres, contentRating, duration)
- `discoverContent` mis à jour vers signature `DiscoverRequest`

---

### 9. Navigation Vega (`apps/vega/src/navigation/types.ts`)

**Bug corrigé :** `RootStackParamList` local Vega définissait :
- `Details: { itemId: string }` → incompatible avec `DetailsScreen` shared-ui
- `Player: { videoId: string }` → incompatible avec `PlayerScreen` shared-ui

**Fix :** Redéfini avec les params complets mirrorant shared-ui. Root screen `Main` préservé (spécifique Vega — différent du `DrawerNavigator` de shared-ui).

---

## État de validation Vega OS

> Cette section distingue explicitement ce qui a été vérifié de ce qui ne l'a pas été.

| Étape | État | Notes |
|---|---|---|
| Compilation TypeScript (`tsc --noEmit`) | ⚠️ Erreurs préexistantes | 206 erreurs dans shared-ui et vega — toutes antérieures au Sprint 3. Causées par l'absence des types RN/Kepler/navigation dans l'environnement de typecheck isolé. Aucune nouvelle erreur introduite. |
| Build Vega release (`react-native build-kepler`) | ❌ Non exécuté | Requiert Vega SDK installé (`$KEPLER_SDK_HOME`). Non disponible dans l'environnement de développement actuel. |
| Génération package APK/bundle Kepler | ❌ Non exécuté | Dépend du build release. |
| Lancement simulateur Fire TV Vega | ❌ Non exécuté | Requiert simulateur Kepler ou appareil physique Fire TV Vega OS. |
| Validation parcours applicatif complet | ❌ Non exécuté | À valider manuellement sur simulateur ou appareil. |

**Pour valider Vega en local :**
```bash
# Prérequis : Vega SDK installé, $KEPLER_SDK_HOME configuré
cd apps/vega
yarn build:debug    # Debug build
yarn build:release  # Release build
```

---

## API — Contrats documentés

### `POST /discover`

**Request :**
```json
{
  "query": "Something dark and cinematic under 90 minutes",
  "familyMode": false
}
```

**Response :**
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

**Rétrocompatibilité :** `familyMode` optionnel, défaut `false`. Les clients Sprint 2 continuent de fonctionner sans modification.

### `GET /health`
```json
{ "status": "ok" }
```

**Infrastructure :** inchangée. Même Lambda `vid30-discovery`, même API Gateway, même région `eu-west-3`, même modèle `eu.amazon.nova-lite-v1:0`.

---

## Limites connues et travaux reportés

### Limites techniques
- **Images catalogue** : les films n'ont pas d'URL de poster — ExploreScreen utilise une image Unsplash générique pour les navigations vers DetailsScreen
- **watchingContext en production** : Nova Lite extrait `watchingContext` mais le schéma Zod est strict — si Nova Lite retourne une valeur inattendue, elle est ignorée (défaut `null`)
- **RuleBasedAIProvider** : support français limité à quelques mots-clés (`sombre`, `cinématographique`, `de moins de`) — Bedrock gère correctement le multilingual en production
- **Catalogue** : 24 films de démonstration, non mis à jour depuis Sprint 2

### Travaux reportés
- **Posters films** : ajouter des URLs d'images par item dans `mockCatalog.ts`
- **Pagination résultats** : la réponse API retourne jusqu'à 24 films sans pagination
- **Validation Vega runtime** : à exécuter quand Vega SDK est disponible
- **Tests E2E** : couverture des appels réseau réels (actuellement mockés via rule-based provider)
- **Catalogue dynamique** : remplacer MockCatalogProvider par une source externe

---

## Fichiers modifiés — Sprint 3

```
apps/api/src/ai/types.ts                    ← watchingContext dans DiscoveryIntentSchema
apps/api/src/ai/RuleBasedAIProvider.ts      ← extraction étendue + bug duration fix
apps/api/src/ai/BedrockProvider.ts          ← prompt Nova Lite mis à jour
apps/api/src/catalog/MockCatalogProvider.ts ← scoring keywords + watchingContext affinity
apps/api/src/discover.test.ts               ← 32 tests (Sprint 2 + 15 nouveaux)

apps/web/                                   ← MVP Web (nouveau)
  package.json, tsconfig.json, vite.config.ts, index.html
  src/main.tsx, src/api.ts, src/App.tsx, src/styles.css

apps/vega/src/navigation/types.ts           ← RootStackParamList corrigé
apps/vega/src/navigation/VegaRootNavigator.tsx ← commentaire alignement

packages/shared-ui/src/data/discoverService.ts  ← types étendus (watchingContext, contentRating, familySafe)
packages/shared-ui/src/screens/ExploreScreen.tsx ← Family Mode toggle + IntentSummary + nav Details

.kiro/specs/sprint-3/requirements.md        ← Spec Sprint 3 (REQ-1 à REQ-7)
package.json                                ← scripts dev:web-mvp, build:web-mvp
SPRINT3.md                                  ← ce document
```
