import { z } from "zod";

export const DiscoveryIntentSchema = z.object({
  mood: z.string().nullable().default(null),
  cinematic: z.boolean().default(false),
  maxDurationMinutes: z.number().int().positive().nullable().default(null),
  genres: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
});

export type DiscoveryIntent = z.infer<typeof DiscoveryIntentSchema>;