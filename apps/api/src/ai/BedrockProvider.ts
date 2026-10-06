import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";
import type { AIProvider } from "./AIProvider";
import {
  DiscoveryIntentSchema,
  type DiscoveryIntent,
} from "./types";

export class BedrockProvider implements AIProvider {
  private client: BedrockRuntimeClient;
  private modelId: string;

  constructor() {
    // AWS_BEDROCK_REGION allows overriding the region for Bedrock calls independently
    // from the Lambda execution region. Required for cross-region inference profiles.
    const region = process.env.AWS_BEDROCK_REGION
      ?? process.env.AWS_REGION
      ?? "eu-west-3";
    // eu. prefix is required for cross-region inference profiles in eu-west-3
    this.modelId =
      process.env.BEDROCK_MODEL_ID || "eu.amazon.nova-lite-v1:0";

    // Le SDK AWS récupère automatiquement les credentials depuis l'environnement
    this.client = new BedrockRuntimeClient({ region });
  }

  async extractDiscoveryIntent(
    query: string,
  ): Promise<DiscoveryIntent> {
    const systemPrompt = `You are Vid30's intent parser. Your only job is to convert a viewer's request into a structured discovery intent.

STRICT RULES:
- Do NOT invent, suggest, or mention any movie or show titles.
- Do NOT recommend content.
- Do NOT explain your reasoning.
- Return ONLY a valid JSON object — no markdown, no backticks, no extra text.

FIELD DEFINITIONS:
- mood: the emotional tone. Must be exactly one of: "dark" | "funny" | "romantic" | "mysterious" — or null if none fits.
- cinematic: true if the viewer wants a visually impressive, epic, or film-like experience. Also true for references like "like a Nolan film", "blockbuster", "arthouse".
- maxDurationMinutes: the maximum runtime in minutes. Convert "under 2 hours" → 120, "90 min" → 90, "short" → 90. Null if not specified.
- genres: array of relevant genres from this list only: ["action", "comedy", "drama", "horror", "mystery", "noir", "romance", "sci-fi", "thriller"]. Infer from context clues ("like Blade Runner" → sci-fi, "spy" → thriller).
- keywords: 2–5 meaningful content descriptors extracted from the query (e.g. "space", "detective", "rain", "cold war"). Exclude stop words.

JSON structure:
{
  "mood": "dark" | "funny" | "romantic" | "mysterious" | null,
  "cinematic": boolean,
  "maxDurationMinutes": number | null,
  "genres": string[],
  "keywords": string[]
}`;

    const command = new ConverseCommand({
      modelId: this.modelId,
      system: [{ text: systemPrompt }],
      messages: [
        {
          role: "user",
          content: [{ text: query }],
        },
      ],
      inferenceConfig: {
        temperature: 0.1,
        maxTokens: 500,
      },
    });

    const response = await this.client.send(command);

    const responseText =
      response.output?.message?.content?.[0]?.text ?? "{}";

    // Nettoyage au cas où le modèle inclurait des balises de code Markdown
    const cleanedJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const rawData = JSON.parse(cleanedJson);

    // Validation stricte du schéma avec Zod
    return DiscoveryIntentSchema.parse(rawData);
  }
}