import { API_BASE_URL } from '../config';

export type DiscoveryIntent = {
  mood: string | null;
  cinematic: boolean;
  maxDurationMinutes: number | null;
  genres: string[];
  keywords: string[];
};

export type DiscoveryResultItem = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  genres: string[];
  mood: string[];
  cinematic: boolean;
};

export type DiscoverResponse = {
  intent: DiscoveryIntent;
  results: DiscoveryResultItem[];
};

/**
 * Calls POST /discover on the Vid30 API.
 * Returns structured intent + matching catalog items from Bedrock + MockCatalog.
 */
export const discoverContent = async (
  query: string,
): Promise<DiscoverResponse> => {
  const response = await fetch(`${API_BASE_URL}/discover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { message?: string }).message ?? `HTTP ${response.status}`,
    );
  }

  return response.json() as Promise<DiscoverResponse>;
};
