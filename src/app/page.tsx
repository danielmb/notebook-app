import Notebooks from '@/components/notebooks';
export default function Home() {
  return (
    <div className="flex flex-col pt-12 px-60 font-sans">
      <h1 className="text-4xl">Welcome to my Notebook app</h1>
      <div className="flex flex-col space-y-2">
        <h2>My Notebooks</h2>
        <hr />
        <Notebooks />
      </div>
    </div>
  );
}
