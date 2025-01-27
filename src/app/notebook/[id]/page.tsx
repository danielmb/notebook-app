import Notebook from '@/components/notebook';
import { getNotebook } from '@/server/notebook';
import React from 'react';
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}
export const Page: React.FC<PageProps> = async ({ params }) => {
  const notebook = getNotebook((await params).id);
  return (
    <div>
      <Notebook notebook={notebook} />
    </div>
  );
};

export default Page;
