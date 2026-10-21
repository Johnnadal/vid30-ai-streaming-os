import type { AIProvider, AIProviderContext } from "./AIProvider";
import {
  DiscoveryIntentSchema,
  type DiscoveryIntent,
  type WatchingContext,
} from "./types";

export class RuleBasedAIProvider implements AIProvider {
  async extractDiscoveryIntent(
    query: string,
    _context?: AIProviderContext,
  ): Promise<DiscoveryIntent> {
    const normalized = query.toLowerCase();

    // ── Mood ──────────────────────────────────────────────────────────────
    let mood: string | null = null;

    if (normalized.includes("dark") || normalized.includes("sombre")) {
      mood = "dark";
    } else if (
      normalized.includes("funny") ||
      normalized.includes("comedy") ||
      normalized.includes("laugh")
    ) {
      mood = "funny";
    } else if (normalized.includes("romantic") || normalized.includes("romance")) {
      mood = "romantic";
    } else if (normalized.includes("mysterious") || normalized.includes("mystery") || normalized.includes("mystérieux")) {
      mood = "mysterious";
    }

    // ── Cinematic ─────────────────────────────────────────────────────────
    const cinematic =
      normalized.includes("cinematic") ||
      normalized.includes("cinématographique") ||
      normalized.includes("cinema") ||
      normalized.includes("blade runner") ||
      normalized.includes("nolan") ||
      normalized.includes("epic") ||
      normalized.includes("arthouse");

    // ── Duration ──────────────────────────────────────────────────────────
    // Capture group 1 = number, group 2 = unit word
    // Supports English prefixes and French "moins de / de moins de"
    const durationMatch = normalized.match(
      /(?:under|less than|below|shorter than|moins de|de moins de)\s+(\d+)\s*(hours?|h(?:\b|$)|minutes?|min)/,
    );

    let maxDurationMinutes: number | null = null;
    if (durationMatch) {
      const value = Number(durationMatch[1]);
      const unit = durationMatch[2];
      const isHours = /^h(ours?)?$/.test(unit);
      maxDurationMinutes = isHours ? value * 60 : value;
    } else if (normalized.includes("short film") || normalized.includes("quick")) {
      maxDurationMinutes = 90;
    }

    // ── Genres ────────────────────────────────────────────────────────────
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
    if (normalized.includes("comedy")) {
      genres.push("comedy");
    }
    if (normalized.includes("action")) {
      genres.push("action");
    }
    if (normalized.includes("romance") || normalized.includes("romantic")) {
      genres.push("romance");
    }
    if (normalized.includes("mystery")) {
      genres.push("mystery");
    }
    if (normalized.includes("noir")) {
      genres.push("noir");
    }
    // Inference from references
    if (normalized.includes("blade runner")) {
      if (!genres.includes("sci-fi")) genres.push("sci-fi");
      if (!genres.includes("thriller")) genres.push("thriller");
    }

    // ── Watching context ──────────────────────────────────────────────────
    let watchingContext: WatchingContext | null = null;

    if (
      normalized.includes("family") ||
      normalized.includes("kids") ||
      normalized.includes("children") ||
      normalized.includes("with the kids") ||
      normalized.includes("soirée famille") ||
      normalized.includes("en famille")
    ) {
      watchingContext = "family";
    } else if (
      normalized.includes("with friends") ||
      normalized.includes("friends") ||
      normalized.includes("group") ||
      normalized.includes("soirée entre amis")
    ) {
      watchingContext = "friends";
    } else if (
      normalized.includes("date night") ||
      normalized.includes("couple") ||
      normalized.includes("partner") ||
      normalized.includes("soirée en amoureux")
    ) {
      watchingContext = "couple";
    } else if (
      normalized.includes("alone") ||
      normalized.includes("solo") ||
      normalized.includes("by myself")
    ) {
      watchingContext = "solo";
    }

    // ── Keywords ──────────────────────────────────────────────────────────
    const STOP_WORDS = new Set([
      "want", "something", "like", "film", "movie", "show", "watch", "with",
      "that", "this", "from", "have", "more", "less", "just", "give", "feel",
      "need", "make", "good", "best", "very", "than", "when", "been", "also",
      "some", "such", "will", "into", "than", "your", "they", "them", "then",
      "pour", "dans", "avec", "mais", "plus", "sous", "tout", "bien", "être",
    ]);

    const keywords = normalized
      .split(/[\s,.'";!?]+/)
      .filter((w) => w.length > 3 && !STOP_WORDS.has(w))
      .slice(0, 10);

    return DiscoveryIntentSchema.parse({
      mood,
      cinematic,
      maxDurationMinutes,
      genres,
      keywords,
      watchingContext,
      // familyMode is NOT set here — injected by DiscoveryService after parsing
    });
  }
}
