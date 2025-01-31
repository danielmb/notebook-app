'use server';
import { prisma } from '@/lib/db';
import { createSourceSchema } from '@/types/source';
import type { Notebook } from './notebook';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';
import { Source } from '@prisma/client';
import { generateTags, summarizeSource } from './ai';

type CreateSourceState =
  | {
      status: 'none';
    }
  | {
      status: 'success';
      data: Source;
    }
  | {
      status: 'error';
      message: string;
      inputError?: ZodError;
    };
export const createSource = async (
  notebookId: Notebook['id'],
  prevState: CreateSourceState,
  formData: FormData,
): Promise<CreateSourceState> => {
  try {
    const data = createSourceSchema.parse({
      content: formData.get('content'),
      title: formData.get('title'),
    });
    const source = await prisma.source.create({
      data: {
        content: data.content,
        title: data.title,
        notebook: {
          connect: {
            id: notebookId,
          },
        },
      },
    });
    revalidatePath(`/notebook/${notebookId}`);
    await summarizeSource(source.id);
    await generateTags(source.id);
    return {
      status: 'success',
      data: source,
    };
  } catch (e) {
    if (e instanceof ZodError) {
      return {
        status: 'error',
        message: 'Invalid input',
        inputError: e,
      };
    }
    if (e instanceof Error) {
      return {
        status: 'error',
        message: e.message,
      };
    }
    return {
      status: 'error',
      message: 'An unknown error occurred',
    };
  }
};

export const getSource = async (id: Source['id']) => {
  if (!id) return null;
  const source = await prisma.source.findUnique({
    where: {
      id,
    },
  });
  return source;
};
