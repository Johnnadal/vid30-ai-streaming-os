/**
 * Smoke test for BedrockProvider.
 * Run with: tsx src/ai/bedrock.smoke.ts
 * Requires AWS credentials configured via `aws configure`.
 */

import { BedrockProvider } from "./BedrockProvider";

const QUERIES = [
  "I want something dark, cinematic and under 90 minutes.",
  "Something funny and light for the weekend.",
  "A romantic drama under 2 hours.",
];

async function run() {
  const provider = new BedrockProvider();

  console.log(
    `\n🚀 BedrockProvider smoke test — model: ${process.env.BEDROCK_MODEL_ID ?? "amazon.nova-lite-v1:0"}\n`,
  );

  for (const query of QUERIES) {
    console.log(`📥 Query: "${query}"`);
    try {
      const intent = await provider.extractDiscoveryIntent(query);
      console.log("✅ Intent:", JSON.stringify(intent, null, 2));
    } catch (err) {
      console.error("❌ Error:", err instanceof Error ? err.message : err);
    }
    console.log("─".repeat(60));
  }
}

run();
