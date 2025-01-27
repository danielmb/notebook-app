import { z } from 'zod';

export const viewtypes = ['grid', 'list'] as const;
export const NoteBookStateSchema = z.object({
  viewtype: z.enum(viewtypes),
});
export type NoteBookState = z.infer<typeof NoteBookStateSchema>;
