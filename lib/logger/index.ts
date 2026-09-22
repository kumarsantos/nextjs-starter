import fs from 'node:fs';
import path from 'node:path';
import winston from 'winston';

/**
 * Production-grade structured logger built on winston.
 *
 * - Metadata is JSON serialised and secret-shaped values are redacted before
 *   anything reaches a transport.
 * - Production emits machine-readable JSON lines to stdout (aggregatable by
 *   Vercel / log SaaS); development keeps a human friendly, colourised output.
 * - File transports are optional and only enabled when `LOG_DIR` is set, so
 *   serverless platforms don't write to an ephemeral filesystem unintentionally.
 * - Set `LOG_LEVEL` (error|warn|info|http|debug) to override the default.
 * - Node-only (imports winston + node:fs/path), so it can be used from server
 *   code, the proxy, and standalone scripts (migrate/seed) alike; importing it
 *   from a client component would fail at build time.
 */

const isProduction = process.env.NODE_ENV === 'production';
const logLevel = process.env.LOG_LEVEL ?? (isProduction ? 'info' : 'debug');
const logDir = process.env.LOG_DIR ? path.resolve(process.env.LOG_DIR) : undefined;

/** Keys whose values must never reach a transport (normalised to lowercase). */
const REDACT_KEY_LOOKUP = new Set([
  'password',
  'token',
  'accesstoken',
  'refreshtoken',
  'secret',
  'apikey',
  'apisecret',
  'authorization',
  'cookie',
  'stripesignature',
]);

/** Recursively replace secret-shaped values so they never hit a transport. */
export function redact(meta: unknown): unknown {
  if (!meta || typeof meta !== 'object') return meta;
  if (meta instanceof Error) {
    const safe: Record<string, unknown> = { name: meta.name, message: meta.message };
    if (meta.stack) safe.stack = meta.stack;
    return safe;
  }
  if (Array.isArray(meta)) return meta.map((m) => redact(m));

  const safe: Record<string, unknown> = {};
  for (const [key, raw] of Object.entries(meta as Record<string, unknown>)) {
    const lookup = key.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    safe[key] = REDACT_KEY_LOOKUP.has(lookup) ? '[REDACTED]' : redact(raw);
  }
  return safe;
}

/**
 * Redact an info object in place. Unlike `redact`, this preserves winston's
 * symbol-keyed triple-beam props (LEVEL/MESSAGE/SPLAT) that logform's
 * colorize and json formats rely on.
 */
function redactInfo(info: Record<string, unknown>): Record<string, unknown> {
  for (const key of Object.keys(info)) {
    const lookup = key.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const value = info[key];
    info[key] = REDACT_KEY_LOOKUP.has(lookup) ? '[REDACTED]' : redact(value);
  }
  return info;
}

/** Redact payload then attach timestamp; JSON-safe for all consumers. */
const structuredFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format((info) => redactInfo(info) as unknown as winston.Logform.TransformableInfo)(),
  winston.format.timestamp(),
  winston.format.json()
);

/** Same safety guarantees but colourised + readable for a terminal. */
const prettyFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format((info) => redactInfo(info) as unknown as winston.Logform.TransformableInfo)(),
  winston.format.timestamp(),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    ({ timestamp, level, message, scope, ...rest }) =>
      `[${timestamp}] ${level}: ${message ?? ''}${scope ? ` (${scope})` : ''}${
        Object.keys(rest).length ? ` ${JSON.stringify(rest)}` : ''
      }`
  )
);

const transports: winston.transport[] = [
  new winston.transports.Console({
    level: logLevel,
    format: isProduction ? structuredFormat : prettyFormat,
  }),
];

// Optional durable file logs e.g. `LOG_DIR=./logs` (dev only recommended).
if (logDir) {
  fs.mkdirSync(logDir, { recursive: true });
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      format: structuredFormat,
      level: logLevel,
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      format: structuredFormat,
      level: 'error',
    })
  );
}

export const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  level: logLevel,
  format: winston.format.splat(),
  defaultMeta: { service: 'time-sheet-tracker', env: process.env.NODE_ENV },
  transports,
  exitOnError: false,
});

/** Child logger pre-bound with a scope for grouping related entries. */
export function createScopedLogger(scope: string): winston.Logger {
  return logger.child({ scope });
}

export type { Logger } from 'winston';
