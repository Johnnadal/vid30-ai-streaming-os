import type { DiscoveryIntent } from "../ai/types";

export type ContentRating = "G" | "PG" | "PG-13" | "R";
export type ContentOrigin = "catalog" | "founder";

/**
 * Detailed content ratings for granular parental controls.
 * Each flag indicates the presence of that content type.
 */
export interface ContentGuidelines {
  /** Minimum recommended age (e.g., 0, 6, 13, 17, 18) */
  minAge: number;
  /** Contains violence or combat scenes */
  violence: boolean;
  /** Contains strong language or profanity */
  language: boolean;
  /** Contains sexual content or nudity */
  sexuality: boolean;
  /** Contains scary/horror/disturbing elements */
  scary: boolean;
}

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
  /** Detailed content guidelines for granular filtering */
  guidelines: ContentGuidelines;
  /** Optional video URL or stream path (MP4, HLS, etc.). For founder content only. */
  videoUrl?: string;
  /** Thumbnail image URL (600×338). For founder content only. */
  imageUrl?: string;
  /** Hero/banner image URL (1920×1080). For founder content only. */
  heroUrl?: string;
}

export interface CatalogProvider {
  discover(intent: DiscoveryIntent): Promise<CatalogItem[]>;
}