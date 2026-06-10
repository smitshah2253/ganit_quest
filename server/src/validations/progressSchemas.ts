import { z } from 'zod';

export const syncProgressSchema = z.object({
  xp: z.number().int().min(0, 'XP cannot be negative'),
  stars: z.number().int().min(0, 'Stars cannot be negative'),
  completedLevels: z.array(z.string()),
  unlockedLevels: z.array(z.string()),
});

export type SyncProgressInput = z.infer<typeof syncProgressSchema>;
