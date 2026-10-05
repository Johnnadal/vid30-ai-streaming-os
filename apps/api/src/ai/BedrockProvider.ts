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
    const region = process.env.AWS_REGION || "eu-west-3";
    this.modelId =
      process.env.BEDROCK_MODEL_ID || "amazon.nova-lite-v1:0";

    // Le SDK AWS récupère automatiquement les credentials depuis l'environnement
    this.client = new BedrockRuntimeClient({ region });
  }

  async extractDiscoveryIntent(
    query: string,
  ): Promise<DiscoveryIntent> {
    const systemPrompt = `You are an AI assistant that extracts user intent for movie and content discovery.
Analyze the user's prompt and extract the structured intent.
Return ONLY a valid JSON object matching this exact structure with no Markdown wrappers, backticks, or extra text:

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