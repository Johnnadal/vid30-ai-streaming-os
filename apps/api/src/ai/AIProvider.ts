import type { DiscoveryIntent } from "./types";

export interface AIProviderContext {
  /** When true, the provider should guide intent extraction towards family-appropriate genres. */
  familyMode?: boolean;
}

export interface AIProvider {
  extractDiscoveryIntent(
    query: string,
    context?: AIProviderContext,
  ): Promise<DiscoveryIntent>;
}
