'use client';

import React from 'react';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { MoreVerticalIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { deleteNotebook, updateNotebook } from '../server/notebook';
import { Button } from './ui/button';
import { GetNotebooksRes } from '@/types/notebook';

import { useConfirm } from './alert-dialog-provider';
interface NotebookEditOptionsProps {
  notebook: GetNotebooksRes[number];
}
export const NotebookEditOptions: React.FC<NotebookEditOptionsProps> = ({
  notebook,
}) => {
  const commandRef = React.useRef<HTMLDivElement>(null);
  const [editNotebook, setEditNotebook] = React.useState(false);
  const updateNotebookWithId = updateNotebook.bind(null, notebook.id);
  const confirm = useConfirm();

  return (
    <>
      <Dialog open={editNotebook} onOpenChange={setEditNotebook}>
        <DialogContent>
          <DialogTitle>Edit Notebook</DialogTitle>
          <DialogDescription>Edit the title of the notebook.</DialogDescription>
          <form
            action={updateNotebookWithId}
            onSubmit={() => {
              setEditNotebook(false);
            }}
          >
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="notebook-title">Title</Label>
                <Input
                  id="notebook-title"
                  type="text"
                  name="title"
                  defaultValue={notebook.title}
                />
              </div>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Popover
        onOpenChange={(open) => {
          setTimeout(() => {
            if (open) {
              commandRef.current?.focus();
            }
          }, 50);
        }}
      >
        <PopoverTrigger>
          <MoreVerticalIcon className="h-5 w-5" />
        </PopoverTrigger>
        <PopoverContent>
          <Command ref={commandRef}>
            <CommandList>
              <CommandInput />
              <CommandGroup>
                <CommandItem
                  autoFocus
                  onSelect={() => {
                    setEditNotebook(true);
                  }}
                >
                  Edit
                </CommandItem>
                <CommandItem
                  onSelect={async () => {
                    const confirmed = await confirm({
                      title: 'Delete Notebook',
                      body: 'Are you sure you want to delete this notebook?',
                      actionButton: 'Delete',
                      cancelButton: 'Cancel',
                    });
                    if (confirmed) {
                      deleteNotebook(notebook.id);
                    }
                  }}
                >
                  Delete
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};
