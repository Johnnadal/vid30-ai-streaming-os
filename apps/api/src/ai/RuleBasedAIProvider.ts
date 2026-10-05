import type { AIProvider } from "./AIProvider";
import {
  DiscoveryIntentSchema,
  type DiscoveryIntent,
} from "./types";

export class RuleBasedAIProvider implements AIProvider {
  async extractDiscoveryIntent(
    query: string,
  ): Promise<DiscoveryIntent> {
    const normalized = query.toLowerCase();

    let mood: string | null = null;

    if (normalized.includes("dark")) {
      mood = "dark";
    } else if (normalized.includes("funny")) {
      mood = "funny";
    } else if (normalized.includes("romantic")) {
      mood = "romantic";
    } else if (normalized.includes("mysterious")) {
      mood = "mysterious";
    }

    const cinematic =
      normalized.includes("cinematic") ||
      normalized.includes("cinema");

    const durationMatch = normalized.match(
      /(?:under|less than|below)\s+(\d+)\s*(?:minutes|min)/,
    );

    const maxDurationMinutes = durationMatch
      ? Number(durationMatch[1])
      : null;

    const genres: string[] = [];

    if (normalized.includes("sci-fi") || normalized.includes("science fiction")) {
      genres.push("sci-fi");
    }

    if (normalized.includes("thriller")) {
      genres.push("thriller");
    }

    if (normalized.includes("drama")) {
      genres.push("drama");
    }

    if (normalized.includes("horror")) {
      genres.push("horror");
    }

    return DiscoveryIntentSchema.parse({
      mood,
      cinematic,
      maxDurationMinutes,
      genres,
      keywords: normalized
        .split(/\s+/)
        .filter((word) => word.length > 3)
        .slice(0, 10),
    });
  }
}