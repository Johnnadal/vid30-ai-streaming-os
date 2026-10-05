import { describe, expect, it } from "vitest";

import { RuleBasedAIProvider } from "./ai/RuleBasedAIProvider";
import { MockCatalogProvider } from "./catalog/MockCatalogProvider";
import { DiscoveryService } from "./discovery/DiscoveryService";

describe("AI Discovery", () => {
  const service = new DiscoveryService(
    new RuleBasedAIProvider(),
    new MockCatalogProvider(),
  );

  it("extracts a structured intent", async () => {
    const result = await service.discover(
      "I want something dark, cinematic and under 90 minutes.",
    );

    expect(result.intent.mood).toBe("dark");
    expect(result.intent.cinematic).toBe(true);
    expect(result.intent.maxDurationMinutes).toBe(90);
  });

  it("returns catalog content instead of inventing content", async () => {
    const result = await service.discover(
      "I want something dark, cinematic and under 90 minutes.",
    );

    expect(result.results.length).toBeGreaterThan(0);

    expect(
      result.results.map((item) => item.title),
    ).toContain("Neon Rain");

    expect(
      result.results.map((item) => item.title),
    ).toContain("The Last Signal");
  });

  it("does not return movies outside the duration constraint", async () => {
    const result = await service.discover(
      "I want something dark and under 80 minutes.",
    );

    for (const item of result.results) {
      expect(item.durationMinutes).toBeLessThanOrEqual(80);
    }
  });
});