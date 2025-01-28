import React from 'react';
import { Button } from './ui/button';
import {
  getNotebooks,
  getNotebookState,
  newNotebook,
} from '../server/notebook';
import { NotebookViewTypeToggle } from './notebook-view-type-toggle';
import { NotebookGrid } from './notebook-grid';

const Notebooks = async () => {
  const notebooks = await getNotebooks();
  const notebookState = await getNotebookState();
  return (
    <div>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row justify-between">
          <Button className="rounded-full" onClick={newNotebook}>
            New Notebook
          </Button>

          <NotebookViewTypeToggle notebookState={notebookState} />
        </div>
        {/* {notebooks.map((notebook) => (
          <div key={notebook.id}>{notebook.title}</div>
        ))} */}
        {notebookState.viewtype === 'grid' ? (
          <NotebookGrid notebooks={notebooks} />
        ) : null}
      </div>
    </div>
  );
};

export default Notebooks;
