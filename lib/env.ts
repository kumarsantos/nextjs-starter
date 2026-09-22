import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

/**
 * Typed, validated access to environment variables.
 *
 * - Server vars are only available in server code; prefix with NEXT_PUBLIC_
 *   to expose them to the browser.
 * - `NEXT_PUBLIC_APP_URL` and `DATABASE_URL` are optional so a fresh clone
 *   can build out of the box. Make `DATABASE_URL` required once a data layer
 *   (and real deployment) exists.
 * - NODE_ENV is always 'development'|'test'|'production' at runtime - Next.js
 *   forces it, so "stage" deployments should be signalled via platform env
 *   (e.g. Vercel's VERCEL_ENV) rather than NODE_ENV.
 */
export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    DATABASE_URL: z.string().url().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
    NEXT_PUBLIC_VERCEL_URL: z.string().url().optional().or(z.literal('')),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
  },
});
