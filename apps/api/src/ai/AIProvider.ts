import type { DiscoveryIntent } from "./types";

export interface AIProvider {
  extractDiscoveryIntent(query: string): Promise<DiscoveryIntent>;
}