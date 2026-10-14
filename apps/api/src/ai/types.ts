import { z } from "zod";

export const DiscoveryIntentSchema = z.object({
  mood: z.string().nullable().default(null),
  cinematic: z.boolean().default(false),
  maxDurationMinutes: z.number().int().positive().nullable().default(null),
  genres: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  /** Passed by the client, never extracted by Bedrock. Default false for backwards compatibility. */
  familyMode: z.boolean().default(false),
});

export type DiscoveryIntent = z.infer<typeof DiscoveryIntentSchema>;