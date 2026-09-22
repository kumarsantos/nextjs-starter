import { env } from '@/lib/env';

/**
 * Resolves the canonical public base URL in priority order:
 * explicit config, Vercel preview/prod URL, then a safe local fallback.
 * Centralised so SEO files never leak placeholder hostnames.
 */
export function getAppUrl(): string {
  return env.NEXT_PUBLIC_APP_URL || env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000';
}
