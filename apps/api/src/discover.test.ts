import { describe, expect, it } from "vitest";

import { RuleBasedAIProvider } from "./ai/RuleBasedAIProvider";
import { MockCatalogProvider } from "./catalog/MockCatalogProvider";
import { DiscoveryService } from "./discovery/DiscoveryService";

describe("AI Discovery", () => {
  const service = new DiscoveryService(
    new RuleBasedAIProvider(),
    new MockCatalogProvider(),
  );

  // --- PHASE A : extraction d'intention ---

  it("extracts mood=dark from query", async () => {
    const result = await service.discover(
      "I want something dark, cinematic and under 90 minutes.",
    );
    expect(result.intent.mood).toBe("dark");
  });

  it("extracts cinematic=true from query", async () => {
    const result = await service.discover(
      "I want something dark, cinematic and under 90 minutes.",
    );
    expect(result.intent.cinematic).toBe(true);
  });

  it("extracts maxDurationMinutes=90 from query", async () => {
    const result = await service.discover(
      "I want something dark, cinematic and under 90 minutes.",
    );
    expect(result.intent.maxDurationMinutes).toBe(90);
  });

  // --- PHASE A : appel catalogue ---

  it("calls catalog and returns real items (not invented content)", async () => {
    const result = await service.discover(
      "I want something dark, cinematic and under 90 minutes.",
    );

    expect(result.results.length).toBeGreaterThan(0);

    const titles = result.results.map((item) => item.title);
    expect(titles).toContain("Neon Rain");
    expect(titles).toContain("The Last Signal");
  });

  it("does not return movies outside the duration constraint (under 90)", async () => {
    const result = await service.discover(
      "I want something dark, cinematic and under 90 minutes.",
    );

    for (const item of result.results) {
      expect(item.durationMinutes).toBeLessThanOrEqual(90);
    }
  });

  it("does not return movies outside the duration constraint (under 80)", async () => {
    const result = await service.discover(
      "I want something dark and under 80 minutes.",
    );

    for (const item of result.results) {
      expect(item.durationMinutes).toBeLessThanOrEqual(80);
    }
  });

  it("returns an empty results array when no catalog items match", async () => {
    // "horror" mood + maxDuration 10 min → aucun item du mockCatalog ne matche
    const result = await service.discover(
      "I want something horror under 10 minutes.",
    );

    expect(result.results).toHaveLength(0);
  });

  // --- PHASE A : requête invalide (validation HTTP) ---
  // Ce cas est géré au niveau Fastify dans index.ts.
  // On le couvre ici via RuleBasedAIProvider directement (query vide → intent vide mais valide).
  it("handles an empty query gracefully at provider level", async () => {
    const provider = new RuleBasedAIProvider();
    const intent = await provider.extractDiscoveryIntent("   ");

    // L'intent doit être valide (pas d'exception) avec toutes les valeurs par défaut
    expect(intent.mood).toBeNull();
    expect(intent.cinematic).toBe(false);
    expect(intent.maxDurationMinutes).toBeNull();
    expect(intent.genres).toEqual([]);
  });
});
