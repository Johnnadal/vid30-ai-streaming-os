import type { AIProvider } from "../ai/AIProvider";
import type { DiscoveryIntent } from "../ai/types";
import type {
  CatalogItem,
  CatalogProvider,
} from "../catalog/CatalogProvider";

export interface DiscoveryResult {
  query: string;
  intent: DiscoveryIntent;
  results: CatalogItem[];
}

export interface DiscoverRequest {
  query: string;
  familyMode?: boolean;
}

export class DiscoveryService {
  constructor(
    private readonly aiProvider: AIProvider,
    private readonly catalogProvider: CatalogProvider,
  ) {}

  async discover(request: DiscoverRequest): Promise<DiscoveryResult> {
    const { query, familyMode = false } = request;

    // Bedrock extracts mood, cinematic, duration, genres, keywords from the query.
    // familyMode is injected after parsing — never extracted by the model.
    const baseIntent = await this.aiProvider.extractDiscoveryIntent(
      query,
      { familyMode },
    );

    const intent: DiscoveryIntent = { ...baseIntent, familyMode };

    const results = await this.catalogProvider.discover(intent);

    return { query, intent, results };
  }
}
