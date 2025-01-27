'use server';
import { prisma } from '@/lib/db';
import type { Notebook } from '@prisma/client';

export const getNotebook = async (id: Notebook['id']) => {
  const notebook = await prisma.notebook.findUnique({
    where: {
      id,
    },
  });
  return notebook;
};
