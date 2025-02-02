import React from 'react';
import { type Notebook } from '../server/notebook';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardFooter,
  CardHeader,
} from './ui/card';
import { FormatDate } from './format-date';
import Link from 'next/link';
import { NotebookEditOptions } from './notebook-edit-options';
interface NotebookGridProps {
  notebooks: Notebook[];
}

export const NotebookGrid = ({ notebooks }: NotebookGridProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {notebooks.map((notebook) => (
        // <div
        //   key={notebook.id}
        //   className="p-4 rounded-lg flex flex-col items-center justify-center border"
        // >
        //   {/* <div className="flex flex-row justify-between w-full">
        //     <div>🥈</div>
        //     <div className="text-lg font-bold">{notebook.id}</div>
        //   </div>
        //   <div className="text-lg font-bold">{notebook.title}</div> */}
        // </div>
        // <Link href={`/notebook/${notebook.id}`} key={notebook.id}>
        <Card key={notebook.id}>
          <CardHeader>
            <div className="flex flex-row justify-between w-full">
              <div>
                <span>🥈</span>
              </div>
              <div className="">
                {/* <Popover>
                  <PopoverTrigger>
                    <MoreVerticalIcon className="h-5 w-5" />
                  </PopoverTrigger>
                  <PopoverContent>
                    <Command>
                      <CommandList>
                        <CommandGroup>
                          <CommandItem>Edit</CommandItem>
                          <CommandItem>Delete</CommandItem>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover> */}
                <NotebookEditOptions notebook={notebook} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription></CardDescription>
          </CardContent>
          <CardFooter className="flex flex-col justify-between">
            <Link href={`/notebook/${notebook.id}`}>
              <CardTitle>{notebook.title}</CardTitle>
            </Link>
            {/* {formatDate(notebook.createdAt)} */}
            <FormatDate date={new Date(notebook.createdAt)} />
          </CardFooter>
        </Card>
        // </Link>
      ))}
    </div>
  );
};
