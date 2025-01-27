'use server';

import { prisma } from '@/lib/db';
import { NoteBookState, NoteBookStateSchema } from '@/types/notebook';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

export const getNotebookState = async () => {
  const cookieStore = await cookies();
  const notebookState = cookieStore.get('notebookState');

  if (!notebookState) {
    return {
      viewtype: 'grid',
    } as NoteBookState;
  }

  return NoteBookStateSchema.parse(JSON.parse(notebookState.value));
};

export const setNotebookState = async (state: NoteBookState) => {
  const cookieStore = await cookies();
  cookieStore.set('notebookState', JSON.stringify(state));
};

export const getNotebooks = cache(async () => {
  const notebooks = await prisma.notebook.findMany();
  return notebooks;
});
export type Notebook = Awaited<ReturnType<typeof getNotebooks>>[0];

export const newNotebook = async () => {
  const createdNotebook = await prisma.notebook.create({
    data: {
      title: 'Untitled notebook',
    },
  });
  redirect(`/notebook/${createdNotebook.id}`);
};
