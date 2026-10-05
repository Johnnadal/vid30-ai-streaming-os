export type ContentItem = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  genres: string[];
  mood: string[];
  cinematic: boolean;
};

export type DiscoveryIntent = {
  mood?: string[];
  genres?: string[];
  maxDurationMinutes?: number;
  cinematic?: boolean;
};

export type DiscoverRequest = {
  query: string;
};

export type DiscoverResponse = {
  intent: DiscoveryIntent;
  results: ContentItem[];
};