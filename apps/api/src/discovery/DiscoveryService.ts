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

export class DiscoveryService {
  constructor(
    private readonly aiProvider: AIProvider,
    private readonly catalogProvider: CatalogProvider,
  ) {}

  async discover(
    query: string,
  ): Promise<DiscoveryResult> {
    const intent =
      await this.aiProvider.extractDiscoveryIntent(query);

    const results =
      await this.catalogProvider.discover(intent);

    return {
      query,
      intent,
      results,
    };
  }
}