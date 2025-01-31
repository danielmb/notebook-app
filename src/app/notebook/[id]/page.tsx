import Notebook from '@/components/notebook/notebook';
import { getNotebook } from '@/server/notebook';
import { getSource } from '@/server/source';
import React from 'react';
interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    [key: string]: string;
  }>;
}
export const Page: React.FC<PageProps> = async ({ params, searchParams }) => {
  const notebook = getNotebook((await params).id);
  const sourceId = (await searchParams).sourceId;
  const source = getSource(sourceId);
  return (
    <div>
      <Notebook notebook={notebook} source={source} />
    </div>
  );
};

export default Page;
