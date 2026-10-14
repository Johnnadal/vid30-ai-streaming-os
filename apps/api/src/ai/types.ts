import { z } from "zod";

/**
 * Watching context — describes the social situation of the viewer.
 * Extracted by the AI from the query when inferable; null otherwise.
 * Never used as a safety signal: familyMode is the authoritative safety switch.
 */
export const WatchingContextSchema = z.enum([
  "solo",
  "couple",
  "family",
  "friends",
]);

export type WatchingContext = z.infer<typeof WatchingContextSchema>;

export const DiscoveryIntentSchema = z.object({
  mood: z.string().nullable().default(null),
  cinematic: z.boolean().default(false),
  maxDurationMinutes: z.number().int().positive().nullable().default(null),
  genres: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  /**
   * Social/viewing context inferred from the query.
   * "family" here is a content-discovery hint only — NOT a safety filter.
   * The authoritative safety switch is familyMode (below).
   */
  watchingContext: WatchingContextSchema.nullable().default(null),
  /** Passed by the client, never extracted by Bedrock. Default false for backwards compatibility. */
  familyMode: z.boolean().default(false),
});

export type DiscoveryIntent = z.infer<typeof DiscoveryIntentSchema>;