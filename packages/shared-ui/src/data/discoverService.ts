import { API_BASE_URL } from '../config';

/**
 * Watching context — mirrors the server-side WatchingContext type.
 * This is a discovery hint extracted from the query, NOT a safety signal.
 */
export type WatchingContext = 'solo' | 'couple' | 'family' | 'friends';
export type ContentOrigin = 'catalog' | 'founder';

export type ContentGuidelines = {
  minAge: number;
  violence: boolean;
  language: boolean;
  sexuality: boolean;
  scary: boolean;
};

/**
 * Structured intent extracted from the natural-language query.
 * Mirrors apps/api/src/ai/types.ts — DiscoveryIntent.
 */
export type DiscoveryIntent = {
  mood: string | null;
  cinematic: boolean;
  maxDurationMinutes: number | null;
  genres: string[];
  keywords: string[];
  /** Social viewing context inferred from the query. Null if not inferable. */
  watchingContext: WatchingContext | null;
  /**
   * Echoes the familyMode flag sent by the client.
   * Always present in the response so the UI can confirm the filter was applied.
   */
  familyMode: boolean;
};

/**
 * A single catalog item returned by the discovery endpoint.
 * Mirrors apps/api/src/catalog/CatalogProvider.ts — CatalogItem.
 */
export type DiscoveryResultItem = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  genres: string[];
  mood: string[];
  cinematic: boolean;
  /**
   * Demo classification — does not represent an official certification.
   * Possible values: "G" | "PG" | "PG-13" | "R"
   */
  contentRating: string;
  /**
   * true if contentRating ∈ {G, PG, PG-13}.
   * Computed at catalog creation — never inferred by AI.
   */
  familySafe: boolean;
  /**
   * Content origin: "catalog" for standard films, "founder" for Vid30 Originals.
   */
  origin: ContentOrigin;
  /**
   * Detailed content guidelines for granular filtering.
   */
  guidelines: ContentGuidelines;
};

export type DiscoverResponse = {
  intent: DiscoveryIntent;
  results: DiscoveryResultItem[];
};

/**
 * Request parameters for POST /discover.
 */
export type DiscoverRequest = {
  query: string;
  /** When true, only familySafe content is returned. Default: false. */
  familyMode?: boolean;
};

/**
 * Calls POST /discover on the Vid30 API.
 * Returns the structured intent understood by the system + matching catalog items.
 *
 * Bedrock is never called from the client — all AI processing happens server-side.
 * No AWS credentials are required or used here.
 */
export const discoverContent = async (
  request: DiscoverRequest,
): Promise<DiscoverResponse> => {
  const response = await fetch(`${API_BASE_URL}/discover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: request.query,
      familyMode: request.familyMode ?? false,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { message?: string }).message ?? `HTTP ${response.status}`,
    );
  }

  return response.json() as Promise<DiscoverResponse>;
};
