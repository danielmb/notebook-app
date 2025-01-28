'use server';

import { ollama } from '@/lib/ai';
import { prisma } from '@/lib/db';
import type { Source } from '@prisma/client';

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
        content:
          'You are tasked with summarizing information, please provide a brief summary of the text from the user.',
      },
      {
        role: 'user',
        content: source.content,
      },
    ],
  });

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
