import Link from 'next/link';

export default function Home() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-start justify-center px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
        Production-grade foundation
      </p>
      <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">
        Build your Next.js product on a solid base.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-neutral-600 dark:text-neutral-400">
        A Next.js 16 starter with the App Router, TypeScript, Tailwind CSS v4, validated environment
        variables, structured logging, SEO, and strict engineering tooling baked in.
      </p>
      <div className="mt-8 flex items-center gap-x-4">
        <Link
          href="/api/health"
          className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Check health
        </Link>
        <Link
          href="https://nextjs.org/docs"
          className="text-sm font-medium text-neutral-700 underline-offset-4 hover:underline dark:text-neutral-300"
        >
          Next.js docs
        </Link>
      </div>
    </section>
  );
}
