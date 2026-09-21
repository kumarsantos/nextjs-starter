import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="space-y-4">
        <p className="text-sm font-semibold tracking-wide uppercase text-neutral-500 dark:text-neutral-400">
          404 Error
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl dark:text-neutral-100">
          Page not found
        </h1>
        <p className="max-w-md text-base text-neutral-600 dark:text-neutral-400">
          Sorry, we couldn’t find the page you’re looking for. It might have been moved or deleted.
        </p>
      </div>

      <div className="mt-8 flex items-center justify-center gap-x-4">
        <Link
          href="/"
          className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 dark:focus-visible:outline-neutral-100"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
