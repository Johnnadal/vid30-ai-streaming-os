/**
 * Vid30 API client — web.
 *
 * Bedrock is never called from the browser. All AI processing happens
 * server-side via the Lambda function. No AWS credentials are required here.
 */

const API_BASE_URL =
  (import.meta as unknown as { env: Record<string, string> }).env
    ?.VITE_API_URL ??
  'https://jows41bdb5.execute-api.eu-west-3.amazonaws.com/prod';

// ── Types (mirror of apps/api — kept inline to avoid RN workspace dep) ────

export type WatchingContext = 'solo' | 'couple' | 'family' | 'friends';

export type DiscoveryIntent = {
  mood: string | null;
  cinematic: boolean;
  maxDurationMinutes: number | null;
  genres: string[];
  keywords: string[];
  watchingContext: WatchingContext | null;
  familyMode: boolean;
};

export type DiscoveryResultItem = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  genres: string[];
  mood: string[];
  cinematic: boolean;
  /** Demo classification — not an official certification. */
  contentRating: string;
  familySafe: boolean;
};

export type DiscoverResponse = {
  intent: DiscoveryIntent;
  results: DiscoveryResultItem[];
};

// ── API call ───────────────────────────────────────────────────────────────

export async function discoverContent(
  query: string,
  familyMode: boolean,
): Promise<DiscoverResponse> {
  const response = await fetch(`${API_BASE_URL}/discover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, familyMode }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as { message?: string };
    throw new Error(err.message ?? `API error ${response.status}`);
  }

  return response.json() as Promise<DiscoverResponse>;
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
