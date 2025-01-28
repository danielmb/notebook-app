import React, { useActionState, useEffect } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { generateTitle } from '@/server/ai';
import { createSource } from '@/server/source';
import { GetNotebookRes } from '@/types/notebook';
// import { ZodError } from 'zod';

// const getError = (field: string) => {
//   if (!inputError) return null;
//   const error = inputError.find((e) => e.path[0] === field);
//   return error?.message;
// };

// interface FormErrorProps extends React.ComponentProps<'div'> {
//   field: string;
//   errors: ZodError['errors'];
// }
// const FormError: React.FC<FormErrorProps> = ({ errors, field, ...props }) => {
//   const error = errors.find((e) => e.path[0] === field);
//   if (!error) return null;
//   return <div {...props}>{error?.message}</div>;
// };

interface AddSourceFormProps {
  onSuccess?: () => void;
  notebook: GetNotebookRes;
}

const AddSourceForm: React.FC<AddSourceFormProps> = ({
  notebook,
  onSuccess,
}) => {
  // const [inputError, setInputError] = React.useState<ZodError | null>(null);
  const titleRef = React.useRef<HTMLInputElement>(null);
  const contentRef = React.useRef<HTMLTextAreaElement>(null);
  const createSourceWithId = createSource.bind(null, notebook.id);
  const [state, action] = useActionState(createSourceWithId, {
    status: 'none',
  });

  useEffect(() => {
    console.log(state);
    switch (state.status) {
      case 'success':
        onSuccess?.();
        break;
      case 'error':
        alert(state.message);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // const inputError = useMemo(() => {
  //   if (state.status === 'error' && state.inputError) {
  //     return state.inputError.errors;
  //   }
  //   return null;
  // }, [state]);
  // useEffect(() => {
  //   if (state.status === 'error' && state.inputError) {
  //     setInputError(state.inputError);
  //   }
  // }, [state]);
  return (
    <div>
      <h1>Add Source</h1>
      <form action={action}>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" type="text" name="title" ref={titleRef} />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" name="content" ref={contentRef} />
            <Button
              type="button"
              onClick={() => {
                const content = contentRef.current?.value;
                if (!content) return;
                generateTitle(content).then((title) => {
                  titleRef.current!.value = title;
                });
              }}
            >
              Generate title
            </Button>
          </div>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
};

export default AddSourceForm;
