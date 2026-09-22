'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="space-y-4">
        <p className="text-sm font-semibold tracking-wide uppercase text-neutral-500 dark:text-neutral-400">
          Error
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl dark:text-neutral-100">
          Something went wrong
        </h1>
        <p className="max-w-md text-base text-neutral-600 dark:text-neutral-400">
          An unexpected error occurred. Your data is safe — try again.
        </p>
      </div>

      <div className="mt-8">
        <button
          onClick={reset}
          className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 dark:focus-visible:outline-neutral-100"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
