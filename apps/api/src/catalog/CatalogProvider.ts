import type { DiscoveryIntent } from "../ai/types";

export type ContentRating = "G" | "PG" | "PG-13" | "R";
export type ContentOrigin = "catalog" | "founder";

export interface CatalogItem {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  genres: string[];
  mood: string[];
  cinematic: boolean;
  /** Demo classification — does not represent an official certification. */
  contentRating: ContentRating;
  /** true if contentRating ∈ ["G","PG","PG-13"]. Computed at catalog creation, never inferred by AI. */
  familySafe: boolean;
  /** Content origin: "catalog" for standard catalog, "founder" for Vid30 Originals */
  origin: ContentOrigin;
}

export interface CatalogProvider {
  discover(intent: DiscoveryIntent): Promise<CatalogItem[]>;
}