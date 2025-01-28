import { getNotebooks } from '@/server/notebook';
import { type getNotebook } from '@/server/notebook';
import { z } from 'zod';
export const viewtypes = ['grid', 'list'] as const;
export const NoteBookStateSchema = z.object({
  viewtype: z.enum(viewtypes),
});
export type NoteBookState = z.infer<typeof NoteBookStateSchema>;

export type GetNotebookRes = Exclude<
  Awaited<ReturnType<typeof getNotebook>>,
  null
>;

export type GetNotebooksRes = Awaited<ReturnType<typeof getNotebooks>>;
