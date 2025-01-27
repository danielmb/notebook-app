'use client';
import { GridIcon, ListIcon, CheckIcon } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';
import { getNotebookState, setNotebookState } from './notebook-actions';
import { NoteBookState } from '@/types/notebook';
interface NotebookViewTypeToggleProps {
  notebookState: NoteBookState;
}
export const NotebookViewTypeToggle = ({
  notebookState,
}: NotebookViewTypeToggleProps) => {
  if (!notebookState) {
    return null;
  }
  return (
    <div className="flex border">
      <Button
        className="rounded-none"
        variant={'ghost'}
        onClick={async () => {
          const oldState = await getNotebookState();
          await setNotebookState({
            ...oldState,
            viewtype: 'grid',
          });
        }}
      >
        {notebookState.viewtype === 'grid' ? (
          <CheckIcon className="h-5 w-5" />
        ) : null}
        <GridIcon className="h-5 w-5" />
      </Button>
      <Button
        className="rounded-none"
        variant={'ghost'}
        onClick={async () => {
          const oldState = await getNotebookState();
          await setNotebookState({
            ...oldState,
            viewtype: 'list',
          });
        }}
      >
        {notebookState.viewtype === 'list' ? (
          <CheckIcon className="h-5 w-5" />
        ) : null}
        <ListIcon className="h-5 w-5" />
      </Button>
    </div>
  );
};
