import type { NextConfig } from 'next';

const isProduction = process.env.NODE_ENV === 'production';

const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'same-origin',
  },
  // Pragmatic baseline. 'unsafe-inline' on script-src is required for
  // next-themes' hydration bootstrap; 'unsafe-eval' is only added in
  // development, where React's debugging features rely on eval().
  // Tighten to a nonce-based CSP before shipping any third-party scripts.
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isProduction ? '' : " 'unsafe-eval'"}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' blob: data:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      'upgrade-insecure-requests',
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true, // Enables 'use cache', cacheLife, and cacheTag
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Add your CDN/storage hostnames here as you adopt remote images:
    // remotePatterns: [{ protocol: 'https', hostname: 'cdn.example.com' }],
  },
  async headers() {
    const headers = [...securityHeaders];

    // HSTS should only be sent over real HTTPS deployments.
    if (isProduction) {
      headers.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      });
    }

    return [
      {
        source: '/(.*)',
        headers,
      },
    ];
  },
};

export default nextConfig;
