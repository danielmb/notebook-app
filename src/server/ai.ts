'use server';

import { ollama } from '@/lib/ai';
import { prisma } from '@/lib/db';
import type { Source } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const summarizeSource = async (sourceId: Source['id']) => {
  const source = await prisma.source.findUniqueOrThrow({
    where: {
      id: sourceId,
    },
  });

  const res = await ollama.chat({
    model: 'llama3.2:latest',
    messages: [
      {
        role: 'system',
        content: `You are tasked with summarizing information, please provide a brief summary of the text from the user. Only respond with the summary.
- Keep it short and concise.
- Do ask the user for more information.
- Do not refer to yourself, or the user.
`,
      },
      {
        role: 'user',
        content: source.content,
      },
    ],
  });

  await prisma.source.update({
    where: {
      id: source.id,
    },
    data: {
      summary: res.message.content,
    },
  });
  revalidatePath(`/notebook/${source.notebookId}`);
  return res.message.content;
};

export const generateTitle = async (text: string) => {
  const res = await ollama.chat({
    // model: 'deepseek-r1:7b',
    model: 'llama3.2:latest',
    messages: [
      {
        role: 'system',
        content:
          'You are tasked with creating a title, please provide a title for the text from the user, keep it short and concise. Only respond with the title. You do not need to add quotes around the title. Make sure to keep it under 100 characters. but try to keep it under 50 characters.',
      },
      {
        role: 'user',
        content: text,
      },
    ],
  });

  return res.message.content;
};

export const generateTags = async (sourceId: Source['id']) => {
  const source = await prisma.source.findUniqueOrThrow({
    where: {
      id: sourceId,
    },
  });
  const text = source.content;
  const res = await ollama.chat({
    model: 'llama3.2:latest',
    messages: [
      {
        role: 'system',
        content:
          'You are tasked with generating tags, please provide a list of tags for the text from the user. Each tag should be separated by a comma. Only respond with the tags.',
      },
      {
        role: 'user',
        content: text,
      },
    ],
  });
  await prisma.source.update({
    where: {
      id: source.id,
    },
    data: {
      keywords: res.message.content.split(',').map((tag) => tag.trim()),
    },
  });
  revalidatePath(`/notebook/${source.notebookId}`);
  return res.message.content.split(',').map((tag) => tag.trim());
  // return res.message.content.split(',').map((tag) => tag.trim());
};
