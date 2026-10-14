import type { DiscoveryIntent } from "../ai/types";
import type {
  CatalogItem,
  CatalogProvider,
} from "./CatalogProvider";
import { mockCatalog } from "./mockCatalog";

/**
 * Watching-context → genre affinity map.
 * Used for a small scoring bonus — NOT a safety filter.
 * "family" here means "content likely to interest a mixed-age group",
 * which is independent of the familyMode safety switch.
 */
const CONTEXT_GENRE_AFFINITY: Record<string, string[]> = {
  family:  ["comedy", "drama", "action"],
  couple:  ["romance", "drama"],
  friends: ["action", "comedy", "thriller", "sci-fi"],
  solo:    ["drama", "sci-fi", "noir", "thriller", "horror"],
};

export class MockCatalogProvider implements CatalogProvider {
  async discover(
    intent: DiscoveryIntent,
  ): Promise<CatalogItem[]> {
    // ── STRICT FILTERS (applied first — inviolable) ────────────────────────

    let items = mockCatalog;

    // 1. Duration cap
    if (
      intent.maxDurationMinutes !== null &&
      intent.maxDurationMinutes !== undefined
    ) {
      items = items.filter(
        (item) => item.durationMinutes <= intent.maxDurationMinutes!,
      );
    }

    // 2. Family Mode — exclude items that are not familySafe.
    //    A film with familySafe !== true cannot be verified as safe,
    //    so it is excluded by default when familyMode is active.
    //    This is a deterministic metadata rule, not an AI decision.
    if (intent.familyMode) {
      items = items.filter((item) => item.familySafe === true);
    }

    // ── SCORING (on remaining items after strict filters) ──────────────────

    const intentKeywords = intent.keywords.map((k) => k.toLowerCase());

    const scored = items.map((item) => {
      let score = 0;

      // Mood match (+5)
      if (intent.mood && item.mood.includes(intent.mood)) {
        score += 5;
      }

      // Cinematic match (+3)
      if (intent.cinematic && item.cinematic) {
        score += 3;
      }

      // Genre match (+3 per genre)
      for (const genre of intent.genres) {
        if (item.genres.includes(genre)) {
          score += 3;
        }
      }

      // Keyword overlap (+1 per keyword found in title or description)
      if (intentKeywords.length > 0) {
        const haystack = `${item.title} ${item.description}`.toLowerCase();
        for (const kw of intentKeywords) {
          if (kw.length > 3 && haystack.includes(kw)) {
            score += 1;
          }
        }
      }

      // watchingContext genre affinity bonus (+2 if any affinity genre matches)
      if (intent.watchingContext) {
        const affinity = CONTEXT_GENRE_AFFINITY[intent.watchingContext] ?? [];
        const hasAffinityMatch = item.genres.some((g) => affinity.includes(g));
        if (hasAffinityMatch) {
          score += 2;
        }
      }

      return { item, score };
    });

    // Minimum score > 0 to appear in results.
    // Tie-break: shorter films first.
    return scored
      .filter(({ score }) => score > 0)
      .sort((a, b) =>
        b.score !== a.score
          ? b.score - a.score
          : a.item.durationMinutes - b.item.durationMinutes,
      )
      .map(({ item }) => item);
  }
}
