import type { DiscoveryIntent } from "../ai/types";

export interface CatalogItem {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  genres: string[];
  mood: string[];
  cinematic: boolean;
}

export interface CatalogProvider {
  discover(intent: DiscoveryIntent): Promise<CatalogItem[]>;
}