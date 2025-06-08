// src/app/dashboard/error.tsx
'use client';

type ErrorProps = {
  error: Error;
};

export default function ErrorFallback({ error }: ErrorProps) {
  return (
    <div className="p-6 bg-red-100 text-red-700 rounded-xl">
      <h2 className="text-xl font-bold">Something went wrong!</h2>
      <pre className="whitespace-pre-wrap mt-2">{error.message}</pre>
    </div>
  );
}
