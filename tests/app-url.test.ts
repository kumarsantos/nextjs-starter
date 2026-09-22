import { describe, expect, it } from 'vitest';
import { getAppUrl } from '@/lib/app-url';

describe('getAppUrl', () => {
  it('always returns an absolute http(s) URL', () => {
    const url = getAppUrl();
    expect(url).toMatch(/^https?:\/\//);
  });
});
