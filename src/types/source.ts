import { z } from 'zod';

export const createSourceSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1).max(50000),
});

export type CreateSource = z.infer<typeof createSourceSchema>;
