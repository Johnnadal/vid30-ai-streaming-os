import type { DiscoveryIntent } from "../ai/types";
import type {
  CatalogItem,
  CatalogProvider,
} from "./CatalogProvider";
import { mockCatalog } from "./mockCatalog";

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

    // 2. Family Mode — exclude items that are not familySafe
    //    A film without a known contentRating cannot be verified as familySafe,
    //    so it is excluded by default when familyMode is active.
    if (intent.familyMode) {
      items = items.filter((item) => item.familySafe === true);
    }

    // ── SCORING (on remaining items after strict filters) ──────────────────

    const scored = items.map((item) => {
      let score = 0;

      if (intent.mood && item.mood.includes(intent.mood)) {
        score += 5;
      }

      if (intent.cinematic && item.cinematic) {
        score += 3;
      }

      for (const genre of intent.genres) {
        if (item.genres.includes(genre)) {
          score += 3;
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
