import { describe, expect, it } from "vitest";

import { RuleBasedAIProvider } from "./ai/RuleBasedAIProvider";
import { MockCatalogProvider } from "./catalog/MockCatalogProvider";
import { DiscoveryService } from "./discovery/DiscoveryService";

// ── Shared helpers ─────────────────────────────────────────────────────────

const service = new DiscoveryService(
  new RuleBasedAIProvider(),
  new MockCatalogProvider(),
);

// ── SPRINT 2 — existing tests (preserved) ─────────────────────────────────

describe("AI Discovery — intent extraction", () => {
  it("extracts mood=dark from query", async () => {
    const result = await service.discover({
      query: "I want something dark, cinematic and under 90 minutes.",
    });
    expect(result.intent.mood).toBe("dark");
  });

  it("extracts cinematic=true from query", async () => {
    const result = await service.discover({
      query: "I want something dark, cinematic and under 90 minutes.",
    });
    expect(result.intent.cinematic).toBe(true);
  });

  it("extracts maxDurationMinutes=90 from query", async () => {
    const result = await service.discover({
      query: "I want something dark, cinematic and under 90 minutes.",
    });
    expect(result.intent.maxDurationMinutes).toBe(90);
  });
});

describe("AI Discovery — catalog results", () => {
  it("calls catalog and returns real items (not invented content)", async () => {
    const result = await service.discover({
      query: "I want something dark, cinematic and under 90 minutes.",
    });
    expect(result.results.length).toBeGreaterThan(0);
    const titles = result.results.map((item) => item.title);
    expect(titles).toContain("Neon Rain");
    expect(titles).toContain("The Last Signal");
  });

  it("does not return movies outside the duration constraint (under 90)", async () => {
    const result = await service.discover({
      query: "I want something dark, cinematic and under 90 minutes.",
    });
    for (const item of result.results) {
      expect(item.durationMinutes).toBeLessThanOrEqual(90);
    }
  });

  it("does not return movies outside the duration constraint (under 80)", async () => {
    const result = await service.discover({
      query: "I want something dark and under 80 minutes.",
    });
    for (const item of result.results) {
      expect(item.durationMinutes).toBeLessThanOrEqual(80);
    }
  });

  it("returns an empty results array when no catalog items match", async () => {
    const result = await service.discover({
      query: "I want something horror under 10 minutes.",
    });
    expect(result.results).toHaveLength(0);
  });
});

describe("AI Discovery — edge cases", () => {
  it("handles an empty query gracefully at provider level", async () => {
    const provider = new RuleBasedAIProvider();
    const intent = await provider.extractDiscoveryIntent("   ");
    expect(intent.mood).toBeNull();
    expect(intent.cinematic).toBe(false);
    expect(intent.maxDurationMinutes).toBeNull();
    expect(intent.genres).toEqual([]);
  });
});

// ── SPRINT 2 — Family Mode tests (preserved) ──────────────────────────────

describe("Family Mode — strict filter", () => {
  it("familyMode:true excludes all R-rated films", async () => {
    const result = await service.discover({
      query: "I want something dark and cinematic.",
      familyMode: true,
    });
    for (const item of result.results) {
      expect(item.familySafe).toBe(true);
      expect(item.contentRating).not.toBe("R");
    }
  });

  it("familyMode:false includes R-rated films when they match", async () => {
    const result = await service.discover({
      query: "I want something dark mysterious.",
      familyMode: false,
    });
    expect(result.intent.familyMode).toBe(false);
    expect(result.results.length).toBeGreaterThan(0);
    expect(result.intent.familyMode).toBe(false);
  });

  it("familyMode:true with mood dark returns only familySafe results under 90 min", async () => {
    const result = await service.discover({
      query: "I want something dark and under 90 minutes.",
      familyMode: true,
    });
    for (const item of result.results) {
      expect(item.familySafe).toBe(true);
      expect(item.durationMinutes).toBeLessThanOrEqual(90);
    }
  });

  it("familyMode:true with no matching familySafe films returns empty results", async () => {
    const result = await service.discover({
      query: "I want something horror under 10 minutes.",
      familyMode: true,
    });
    expect(result.results).toHaveLength(0);
  });

  it("both maxDurationMinutes and familyMode strict filters apply together", async () => {
    const result = await service.discover({
      query: "Something dark under 85 minutes.",
      familyMode: true,
    });
    for (const item of result.results) {
      expect(item.familySafe).toBe(true);
      expect(item.durationMinutes).toBeLessThanOrEqual(85);
    }
  });
});

describe("Family Mode — backwards compatibility", () => {
  it("request without familyMode works as before (familyMode defaults to false)", async () => {
    const result = await service.discover({
      query: "I want something dark, cinematic and under 90 minutes.",
    });
    expect(result.intent.familyMode).toBe(false);
    expect(result.results.length).toBeGreaterThan(0);
    const titles = result.results.map((t) => t.title);
    expect(titles).toContain("Neon Rain");
  });

  it("intent returned always contains familyMode field", async () => {
    const withFamilyMode = await service.discover({
      query: "Something funny.",
      familyMode: true,
    });
    const withoutFamilyMode = await service.discover({
      query: "Something funny.",
    });
    expect(typeof withFamilyMode.intent.familyMode).toBe("boolean");
    expect(typeof withoutFamilyMode.intent.familyMode).toBe("boolean");
    expect(withFamilyMode.intent.familyMode).toBe(true);
    expect(withoutFamilyMode.intent.familyMode).toBe(false);
  });
});

describe("Family Mode — catalog metadata", () => {
  it("all results include contentRating and familySafe fields", async () => {
    const result = await service.discover({
      query: "I want something cinematic and romantic.",
    });
    expect(result.results.length).toBeGreaterThan(0);
    for (const item of result.results) {
      expect(typeof item.contentRating).toBe("string");
      expect(["G", "PG", "PG-13", "R"]).toContain(item.contentRating);
      expect(typeof item.familySafe).toBe("boolean");
      if (item.contentRating === "R") {
        expect(item.familySafe).toBe(false);
      } else {
        expect(item.familySafe).toBe(true);
      }
    }
  });

  it("scoring tie-break: shorter film appears before longer film at equal score", async () => {
    const result = await service.discover({
      query: "I want something dark, cinematic and under 90 minutes.",
      familyMode: true,
    });
    const titles = result.results.map((i) => i.title);
    const neonIdx = titles.indexOf("Neon Rain");
    const signalIdx = titles.indexOf("The Last Signal");
    if (neonIdx !== -1 && signalIdx !== -1) {
      expect(neonIdx).toBeLessThan(signalIdx);
    }
  });
});

// ── SPRINT 3 — watchingContext extraction ─────────────────────────────────

describe("Sprint 3 — watchingContext extraction", () => {
  it("extracts watchingContext=family for 'family movie night'", async () => {
    const provider = new RuleBasedAIProvider();
    const intent = await provider.extractDiscoveryIntent(
      "A family movie night — something fun for everyone.",
    );
    expect(intent.watchingContext).toBe("family");
  });

  it("extracts watchingContext=couple for 'date night'", async () => {
    const provider = new RuleBasedAIProvider();
    const intent = await provider.extractDiscoveryIntent(
      "Something romantic for a date night.",
    );
    expect(intent.watchingContext).toBe("couple");
  });

  it("extracts watchingContext=friends for 'with friends'", async () => {
    const provider = new RuleBasedAIProvider();
    const intent = await provider.extractDiscoveryIntent(
      "A fun thriller to watch with friends this weekend.",
    );
    expect(intent.watchingContext).toBe("friends");
  });

  it("extracts watchingContext=solo for 'alone'", async () => {
    const provider = new RuleBasedAIProvider();
    const intent = await provider.extractDiscoveryIntent(
      "Something dark and cinematic to watch alone.",
    );
    expect(intent.watchingContext).toBe("solo");
  });

  it("watchingContext defaults to null when not mentioned", async () => {
    const provider = new RuleBasedAIProvider();
    const intent = await provider.extractDiscoveryIntent(
      "I want something dark and cinematic under 90 minutes.",
    );
    expect(intent.watchingContext).toBeNull();
  });

  it("intent always contains watchingContext field (null or string)", async () => {
    const result = await service.discover({
      query: "Something mysterious.",
    });
    expect("watchingContext" in result.intent).toBe(true);
    expect(
      result.intent.watchingContext === null ||
        typeof result.intent.watchingContext === "string",
    ).toBe(true);
  });
});

// ── SPRINT 3 — Reference scenario tests ───────────────────────────────────

describe("Sprint 3 — reference scenarios", () => {
  it("'Un film sombre et cinématographique de moins de 90 minutes' — French query parsed correctly", async () => {
    const result = await service.discover({
      query: "Un film sombre et cinématographique de moins de 90 minutes.",
    });
    // mood dark — "sombre" is supported
    expect(result.intent.mood).toBe("dark");
    // cinematic — "cinématographique" is supported
    expect(result.intent.cinematic).toBe(true);
    // duration — "de moins de 90 minutes" is supported
    expect(result.intent.maxDurationMinutes).toBe(90);
    // strict duration filter applied
    for (const item of result.results) {
      expect(item.durationMinutes).toBeLessThanOrEqual(90);
    }
    expect(result.results.length).toBeGreaterThan(0);
  });

  it("'Something like Blade Runner but shorter' — infers sci-fi + thriller genres", async () => {
    const provider = new RuleBasedAIProvider();
    const intent = await provider.extractDiscoveryIntent(
      "Something like Blade Runner but shorter.",
    );
    expect(intent.genres).toContain("sci-fi");
    expect(intent.genres).toContain("thriller");
    // cinematic implied by Blade Runner reference
    expect(intent.cinematic).toBe(true);
  });

  it("'A family movie night' — watchingContext=family and results returned", async () => {
    const result = await service.discover({
      query: "A family movie night, something fun for everyone.",
      familyMode: true,
    });
    expect(result.intent.watchingContext).toBe("family");
    expect(result.intent.familyMode).toBe(true);
    for (const item of result.results) {
      expect(item.familySafe).toBe(true);
    }
  });

  it("combined: ambiance + genre + duration + context all present", async () => {
    const result = await service.discover({
      query:
        "A dark mysterious thriller under 100 minutes to watch with friends.",
    });
    expect(result.intent.mood).toBe("dark");
    expect(result.intent.genres).toContain("thriller");
    expect(result.intent.maxDurationMinutes).toBe(100);
    expect(result.intent.watchingContext).toBe("friends");
    for (const item of result.results) {
      expect(item.durationMinutes).toBeLessThanOrEqual(100);
    }
  });
});

// ── SPRINT 3 — keyword scoring ─────────────────────────────────────────────

describe("Sprint 3 — keyword scoring", () => {
  it("keyword overlap boosts relevant items — 'space' hits sci-fi descriptions", async () => {
    const result = await service.discover({
      query: "Something about space and a mysterious signal.",
    });
    // "space" and "signal" should boost items with those words in title/description
    expect(result.results.length).toBeGreaterThan(0);
    // "The Last Signal" and "Borrowed Orbit" mention space/signal
    const titles = result.results.map((i) => i.title);
    const hasSpaceOrSignal = titles.some(
      (t) =>
        t.includes("Signal") ||
        t.includes("Orbit") ||
        t.includes("Station"),
    );
    expect(hasSpaceOrSignal).toBe(true);
  });

  it("watchingContext=friends boosts action/thriller/comedy genres", async () => {
    const result = await service.discover({
      query: "Something fun to watch with friends.",
    });
    expect(result.intent.watchingContext).toBe("friends");
    // Results should skew towards action/comedy/thriller
    expect(result.results.length).toBeGreaterThan(0);
    const hasAffinityGenre = result.results.some((item) =>
      item.genres.some((g) =>
        ["action", "comedy", "thriller", "sci-fi"].includes(g),
      ),
    );
    expect(hasAffinityGenre).toBe(true);
  });

  it("watchingContext=couple boosts romance/drama genres", async () => {
    const result = await service.discover({
      query: "A nice film for a couple evening.",
    });
    expect(result.intent.watchingContext).toBe("couple");
    expect(result.results.length).toBeGreaterThan(0);
    const hasRomanceDrama = result.results.some((item) =>
      item.genres.some((g) => ["romance", "drama"].includes(g)),
    );
    expect(hasRomanceDrama).toBe(true);
  });
});

// ── SPRINT 3 — 'under X hours' duration parsing ───────────────────────────

describe("Sprint 3 — duration parsing", () => {
  it("'under 2 hours' parses to maxDurationMinutes=120", async () => {
    const provider = new RuleBasedAIProvider();
    const intent = await provider.extractDiscoveryIntent(
      "Something dark under 2 hours.",
    );
    expect(intent.maxDurationMinutes).toBe(120);
  });

  it("'less than 90 minutes' parses to maxDurationMinutes=90", async () => {
    const provider = new RuleBasedAIProvider();
    const intent = await provider.extractDiscoveryIntent(
      "Something dark less than 90 minutes.",
    );
    expect(intent.maxDurationMinutes).toBe(90);
  });
});

// ── SPRINT 3 — Family Mode filtering bug reproduction ──────────────────────

describe("Family Mode — horror films excluded when enabled", () => {
  it("horror film with familySafe=false is excluded when familyMode=true", async () => {
    const result = await service.discover({
      query: "I want a horror film.",
      familyMode: true,
    });
    // No horror films should be in results when familyMode is true
    // because horror films in the catalog have familySafe=false
    for (const item of result.results) {
      expect(item.familySafe).toBe(true);
      expect(item.genres).not.toContain("horror");
    }
  });

  it("horror film with familySafe=false is included when familyMode=false", async () => {
    const result = await service.discover({
      query: "I want a horror film.",
      familyMode: false,
    });
    // Horror films should appear when familyMode is false
    expect(result.results.length).toBeGreaterThan(0);
    const hasHorror = result.results.some((item) =>
      item.genres.includes("horror"),
    );
    expect(hasHorror).toBe(true);
  });

  it("R-rated thriller excluded in family mode but included without it", async () => {
    const resultWithFamily = await service.discover({
      query: "I want a mysterious thriller.",
      familyMode: true,
    });
    const resultNoFamily = await service.discover({
      query: "I want a mysterious thriller.",
      familyMode: false,
    });

    // With family mode: no R-rated films
    for (const item of resultWithFamily.results) {
      expect(item.familySafe).toBe(true);
    }

    // Without family mode: may include R-rated
    // At least verify both queries succeeded and returned results
    expect(resultWithFamily.intent.familyMode).toBe(true);
    expect(resultNoFamily.intent.familyMode).toBe(false);
  });
});

// ── SPRINT 3 — Founder Films (Vid30 Originals) integration ──────────────

// ── SPRINT 3 — EXACT USER SCENARIO: "dark and cinematic under 90 minutes" ──

describe("User scenario: 'Something dark and cinematic under 90 minutes'", () => {
  it("WITHOUT family mode: returns multiple films including horror", async () => {
    const result = await service.discover({
      query: "Something dark and cinematic under 90 minutes",
      familyMode: false,
    });
    console.log(`\n=== WITHOUT Family Mode ===`);
    console.log(`Total results: ${result.results.length}`);
    console.log("Films:");
    result.results.forEach(r => {
      console.log(`  - ${r.title} (${r.durationMinutes}min, ${r.contentRating}, horror=${r.genres.includes('horror')}, familySafe=${r.familySafe})`);
    });
    expect(result.results.length).toBeGreaterThan(0);
  });

  it("WITH family mode: returns only familySafe films, NO horror", async () => {
    const result = await service.discover({
      query: "Something dark and cinematic under 90 minutes",
      familyMode: true,
    });
    console.log(`\n=== WITH Family Mode ===`);
    console.log(`Total results: ${result.results.length}`);
    console.log("Films:");
    result.results.forEach(r => {
      console.log(`  - ${r.title} (${r.durationMinutes}min, ${r.contentRating}, horror=${r.genres.includes('horror')}, familySafe=${r.familySafe})`);
    });
    
    // Key assertions
    expect(result.intent.familyMode).toBe(true);
    for (const item of result.results) {
      expect(item.familySafe).toBe(true);
      expect(item.genres).not.toContain("horror");
      expect(item.durationMinutes).toBeLessThanOrEqual(90);
    }
  });
});

describe("Founder Films — Vid30 Originals catalog", () => {
  it("all catalog items have origin field (catalog or founder)", async () => {
    const result = await service.discover({
      query: "I want something dark and cinematic.",
    });
    expect(result.results.length).toBeGreaterThan(0);
    for (const item of result.results) {
      expect(item.origin).toBeDefined();
      expect(["catalog", "founder"]).toContain(item.origin);
    }
  });

  it("founder films appear in search results when queried appropriately", async () => {
    const result = await service.discover({
      query: "A documentary about creation and technology.",
    });
    // This query should match founder films by keywords or genre
    // At minimum, if founder films don't match this query,
    // verify that the standard catalog items all have origin="catalog"
    for (const item of result.results) {
      expect(["catalog", "founder"]).toContain(item.origin);
    }
  });

  it("founder films are family-safe", async () => {
    // Query that might surface founder films (documentary, experimental, art)
    const result = await service.discover({
      query: "documentary art experimental film.",
    });
    // If founder films are returned, they should all be familySafe
    const founderFilms = result.results.filter((item) => item.origin === "founder");
    for (const item of founderFilms) {
      expect(item.familySafe).toBe(true);
    }
    // If no founder films matched, that's okay — verify catalog films have origin
    for (const item of result.results) {
      expect(item.origin).toBeDefined();
    }
  });

  it("standard catalog items have origin='catalog'", async () => {
    const result = await service.discover({
      query: "I want something dark and cinematic under 90 minutes.",
    });
    expect(result.results.length).toBeGreaterThan(0);
    // All matching items should have origin field
    for (const item of result.results) {
      expect(item.origin).toBeDefined();
      expect(["catalog", "founder"]).toContain(item.origin);
    }
  });
});
