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
    const scored = mockCatalog.map((item) => {
      let score = 0;

      if (
        intent.mood &&
        item.mood.includes(intent.mood)
      ) {
        score += 5;
      }

      if (
        intent.cinematic &&
        item.cinematic
      ) {
        score += 3;
      }

      if (
        intent.maxDurationMinutes !== null &&
        item.durationMinutes <=
          intent.maxDurationMinutes
      ) {
        score += 4;
      }

      for (const genre of intent.genres) {
        if (item.genres.includes(genre)) {
          score += 3;
        }
      }

      return {
        item,
        score,
      };
    });

    return scored
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item);
  }
}