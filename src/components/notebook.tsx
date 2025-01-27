'use client';
import { SidebarClose, SidebarOpen } from 'lucide-react';
import React, { use } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import AddSourceForm from './sources-form';
import Link from 'next/link';
import { getNotebook } from '@/server/notebook';
interface TabProps {
  title: string;
}
const Tab: React.FC<React.PropsWithChildren<TabProps>> = ({
  title,
  children,
}) => {
  const [minimized, setMinimized] = React.useState(false);
  return (
    <div
      className={cn(
        'flex flex-col dark:bg-zinc-900  rounded',
        !minimized && 'w-full',
      )}
    >
      {!minimized ? (
        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-between w-full border-b border-muted-foreground p-2">
            <span className="text-sm font-bold font-sans">{title}</span>
            <Button onClick={() => setMinimized(true)} variant="ghost">
              <SidebarClose />
            </Button>
          </div>
          <div className="p-2">{children}</div>
        </div>
      ) : (
        <div className="flex flex-row justify-between w-full">
          <Button onClick={() => setMinimized(false)} variant="ghost">
            <SidebarOpen />
          </Button>
        </div>
      )}
    </div>
  );
};

const Sources = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="rounded-full w-full
          "
              variant={'outline'}
            >
              New Source
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>New Source</DialogTitle>
            <DialogDescription>
              Add a new source to your notebook.
            </DialogDescription>
            <AddSourceForm />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
const Chat = () => {
  return <div>Chat</div>;
};

const Studio = () => {
  return <p>Studio</p>;
};

interface NotebookProps {
  notebook: ReturnType<typeof getNotebook>;
}
const Notebook: React.FC<NotebookProps> = ({ notebook }) => {
  const notebookData = use(notebook);
  return (
    <div className="flex flex-col min-h-screen p-2 space-y-2 ">
      {/* Logo */}
      <Link href="/">
        <div className="flex flex-row">
          <h1 className="text-md font-sans">Notebook</h1>
          <span className="text-md font-sans text-muted-foreground">/</span>
          <h1 className="text-md font-sans">{notebookData?.title}</h1>
        </div>
      </Link>
      <div className="flex flex-row justify-between space-x-10 min-h-max flex-grow font-sans">
        <Tab title="Sources">
          <Sources />
        </Tab>
        <Tab title="Chat">
          <Chat />
        </Tab>
        <Tab title="Studio">
          <Studio />
        </Tab>
      </div>
    </div>
  );
};

export default Notebook;
