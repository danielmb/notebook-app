'use client';
import { Minimize2, SidebarClose, SidebarOpen } from 'lucide-react';
import React, { use, useEffect } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import AddSourceForm from '../sources-form';
import Link from 'next/link';
import { getNotebook } from '@/server/notebook';
import { NotebookProvider, useNotebook } from './notebook-provider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { getSource } from '@/server/source';
import { useRouter, useSearchParams } from 'next/navigation';
import { Source } from '@prisma/client';
import { generateTags, summarizeSource } from '@/server/ai';
interface TabProps {
  title: string;
  onClose?: () => void;
  showClose?: boolean;
  closePopover?: string;
}
const Tab: React.FC<React.PropsWithChildren<TabProps>> = ({
  title,
  children,
  onClose,
  showClose = false,
  closePopover,
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
            {showClose ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={onClose} variant="ghost">
                      <Minimize2 />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">{closePopover}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Button onClick={() => setMinimized(true)} variant="ghost">
                <SidebarClose />
              </Button>
            )}
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
  const { notebook, setSelectedSourceId, source } = useNotebook();
  const [sourceFormOpen, setSourceFormOpen] = React.useState(
    notebook.sources.length === 0,
  );
  return (
    <div className="flex flex-col">
      {source ? (
        <div className="flex flex-col space-y-2">
          <h1>Source</h1>
          <span>{source?.id}</span>
          {source?.summary ? (
            <div>{source?.summary}</div>
          ) : (
            <Button
              onClick={() => {
                summarizeSource(source.id);
              }}
            >
              Summarize
            </Button>
          )}
          {source?.keywords &&
          Array.isArray(source.keywords) &&
          source.keywords.length > 0 ? (
            <div>{source?.keywords.join(', ')}</div>
          ) : (
            <Button
              onClick={() => {
                generateTags(source.id);
              }}
            >
              Generate Tags
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="flex flex-row justify-between">
            <Dialog
              defaultOpen={notebook.sources.length === 0}
              open={sourceFormOpen}
              onOpenChange={setSourceFormOpen}
            >
              <DialogTrigger asChild>
                <Button className="rounded-full w-full" variant={'outline'}>
                  New Source
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>New Source</DialogTitle>
                <DialogDescription>
                  Add a new source to your notebook.
                </DialogDescription>
                <AddSourceForm
                  onSuccess={() => {
                    setSourceFormOpen(false);
                  }}
                  notebook={notebook}
                />
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-col space-y-2">
            {notebook.sources.map((source) => (
              // <div key={source.id}>{source.title}</div>
              <div
                key={source.id}
                className="flex flex-row justify-between border p-2"
              >
                <div>{source.title}</div>
                <Button onClick={() => setSelectedSourceId(source.id)}>
                  Open
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
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
  source: ReturnType<typeof getSource>;
}
const Notebook: React.FC<NotebookProps> = ({ notebook, source }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const notebookData = use(notebook);
  const sourceData = use(source);
  const [selectedSourceId, setSelectedSourceId] = React.useState<
    Source['id'] | null
  >(null);

  // const [selectedSourceId, setSelectedSourceId] = useQueryState(
  //   'sourceId',
  //   parseAsString,
  // );
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (selectedSourceId) {
      newParams.set('sourceId', selectedSourceId);
    } else {
      newParams.delete('sourceId');
    }
    console.log(newParams.toString());
    router.replace(`?${newParams.toString()}`);
  }, [selectedSourceId, router, searchParams]);

  if (!notebookData) {
    return <div>Loading...</div>;
  }
  return (
    <NotebookProvider
      notebook={notebookData}
      source={sourceData}
      selectedSourceId={selectedSourceId}
      setSelectedSourceId={setSelectedSourceId}
    >
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
          <Tab
            title="Sources"
            onClose={() => {
              setSelectedSourceId(null);
            }}
            showClose={!!selectedSourceId}
            closePopover="Close source"
          >
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
    </NotebookProvider>
  );
};

export default Notebook;
