'use client';

import { createContext, useContext } from 'react';
import { GetNotebookRes } from '@/types/notebook';
import { Source } from '@prisma/client';
import { GetSourceRes } from '@/types/source';

interface NotebookContextType {
  notebook: GetNotebookRes;
  source: GetSourceRes;
  selectedSourceId: Source['id'] | null;
  setSelectedSourceId: React.Dispatch<
    React.SetStateAction<Source['id'] | null>
  >;
}

export const NotebookContext = createContext<NotebookContextType | undefined>(
  undefined,
);

export const useNotebook = () => {
  const context = useContext(NotebookContext);
  if (context === undefined) {
    throw new Error('useNotebook must be used within a NotebookProvider');
  }
  return context;
};

interface NotebookProviderProps {
  source: GetSourceRes;
  notebook: GetNotebookRes;
  selectedSourceId: Source['id'] | null;
  setSelectedSourceId: React.Dispatch<
    React.SetStateAction<Source['id'] | null>
  >;
}

export const NotebookProvider: React.FC<
  React.PropsWithChildren<NotebookProviderProps>
> = ({ notebook, children, selectedSourceId, setSelectedSourceId, source }) => {
  return (
    <NotebookContext.Provider
      value={{
        source,
        notebook,
        selectedSourceId,
        setSelectedSourceId,
      }}
    >
      {children}
    </NotebookContext.Provider>
  );
};
