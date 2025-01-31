'use server';
import { prisma } from '@/lib/db';
import type { Notebook as PrismaNotebook } from '@prisma/client';
import { NoteBookState, NoteBookStateSchema } from '@/types/notebook';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export const getNotebook = unstable_cache(
  async (id: PrismaNotebook['id']) => {
    const notebook = await prisma.notebook.findUnique({
      where: {
        id,
      },

      include: {
        sources: true,
      },
    });
    return notebook;
  },
  ['notebook'],
  { tags: ['notebook'] },
);

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

export const getNotebooks = unstable_cache(
  async () => {
    const notebooks = await prisma.notebook.findMany();
    return notebooks;
  },
  ['notebooks'],
  { tags: ['notebooks'] },
);
export type Notebook = Awaited<ReturnType<typeof getNotebooks>>[0];

export const newNotebook = async () => {
  const createdNotebook = await prisma.notebook.create({
    data: {
      title: 'Untitled notebook',
    },
  });
  revalidateTag('notebooks');
  redirect(`/notebook/${createdNotebook.id}`);
};

export const updateNotebook = async (
  id: Notebook['id'],
  formData: FormData,
) => {
  const title = z.string().parse(formData.get('title'));
  await prisma.notebook.update({
    where: {
      id,
    },
    data: {
      title,
    },
  });
  revalidatePath(`/notebook/${id}`);
  // revalidatePath(`/`);
  revalidateTag('notebooks');
};

export const deleteNotebook = async (id: Notebook['id']) => {
  await prisma.notebook.delete({
    where: {
      id,
    },
  });
  // revalidatePath(`/`);
  revalidateTag('notebooks');
};
