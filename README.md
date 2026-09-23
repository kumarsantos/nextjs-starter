# Next.js Starter

A production-grade [Next.js 16](https://nextjs.org) starter using the App
Router, TypeScript, Tailwind CSS v4, and a hard-edged engineering toolchain.

## Stack

- **Framework:** Next.js 16 (App Router, React 19)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 + `next/font` (Inter, JetBrains Mono)
- **Validation:** `@t3-oss/env-nextjs` + Zod runtime environment checks
- **Logging:** winston with secret redaction, JSON in prod / pretty in dev
- **SEO:** metadata/viewport API, sitemap, robots (incl. AI-crawler rules), JSON-LD
- **Security headers:** CSP, HSTS (prod only), COOP, CORP, nosniff, frame deny
- **Tooling:** ESLint 9 flat config, Prettier, Husky, commitlint, lint-staged,
  branch-name + push-guard scripts, GitHub Actions CI, Vitest

## Getting started

```bash
pnpm install
cp .env.example .env.local   # edit for your environment
pnpm dev                     # http://localhost:3000
```

Optional local Postgres for later work:

```bash
pnpm db:up                  # docker compose up -d
```

## Scripts

| Command                  | Description                                        |
| ------------------------ | -------------------------------------------------- |
| `pnpm dev`               | Start the dev server                               |
| `pnpm build`             | Production build                                   |
| `pnpm start`             | Start the production server                        |
| `pnpm lint`              | ESLint                                             |
| `pnpm typecheck`         | `tsc --noEmit`                                     |
| `pnpm test`              | Vitest (unit)                                      |
| `pnpm check`             | typecheck + lint + test (used by hooks/CI)         |
| `pnpm format`            | Prettier write                                     |
| `pnpm og:generate`       | Regenerate `public/assets/og-default.png` from SVG |
| `pnpm db:up` / `db:down` | Start/stop local Postgres (docker)                 |

## Structure

```
app/          App Router routes: layout, page, error, loading, not-found,
              robots, sitemap, api/health
components/   React components (providers/, ui/)
lib/          env, app-url, fonts, logger, seo, viewport
scripts/      og-image generator, git guard scripts
tests/        Vitest unit tests
```

Placeholders (`actions/`, `services/`, `database/`, `hooks/`, ...) ship as
`.gitkeep` so the intended layering survives a fresh clone.

## Environment

Required by the app today: `NEXT_PUBLIC_APP_URL` (canonical public URL for
metadata/sitemap). `DATABASE_URL` is validated but optional until a data layer
is added. See `.env.example` for full list.

## Git hygiene

- Branch names: `feature/`, `fix/`, `hotfix/`, `chore/`, `refactor/`, ...
- Commits: Conventional Commits via commitlint.
- Direct pushes to `main`/`develop`/`staging`/`release` are blocked locally;
  push a feature branch and merge via pull request.

## Deployment

Build output is platform-agnostic (tested on Vercel-compatible hosts). CI runs
format, lint, typecheck, and tests on every pull request, plus a Docker image
build (without deployment). Pushes to `main`/`develop` run the same checks and
also build the Docker image. Every PR gets a unique image tag based on the
author and PR number (e.g. `next-js-starter:pr-<user>-pr<number>-<sha>`), and
references are logged in the CI output so they can be copied and used manually
(`docker run`/`docker tag`/`docker push`).
