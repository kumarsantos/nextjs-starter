import { describe, expect, it } from 'vitest';
import { redact } from '@/lib/logger';

describe('redact', () => {
  it('redacts secret-shaped top-level keys', () => {
    const out = redact({ password: 's3cret', token: 'abc', api_key: 'k', name: 'ok' });
    expect(out).toEqual({
      password: '[REDACTED]',
      token: '[REDACTED]',
      api_key: '[REDACTED]',
      name: 'ok',
    });
  });

  it('recursively redacts nested objects and arrays', () => {
    const out = redact({
      user: { authorization: 'Bearer abc', displayName: 'Jane' },
      traces: [{ secret: 'x' }, { ok: true }],
    });
    expect(out).toEqual({
      user: { authorization: '[REDACTED]', displayName: 'Jane' },
      traces: [{ secret: '[REDACTED]' }, { ok: true }],
    });
  });

  it('normalises errors into safe plain objects without leaking keys', () => {
    const out = redact(new Error('boom') as unknown);
    expect(out).toMatchObject({ name: 'Error', message: 'boom' });
    expect(typeof (out as { stack?: string }).stack).toBe('string');
  });

  it('passes through primitives untouched', () => {
    expect(redact('plain')).toBe('plain');
    expect(redact(null)).toBe(null);
  });
});
