'use client';

import { createContext, useContext } from 'react';
import { GetNotebookRes } from '@/types/notebook';

interface NotebookContextType {
  notebook: GetNotebookRes;
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
  notebook: GetNotebookRes;
}

export const NotebookProvider: React.FC<
  React.PropsWithChildren<NotebookProviderProps>
> = ({ notebook, children }) => {
  return (
    <NotebookContext.Provider value={{ notebook }}>
      {children}
    </NotebookContext.Provider>
  );
};
