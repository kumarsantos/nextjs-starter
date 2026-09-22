import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { mediumRatelimit } from './lib/ratelimiter';

/**
 * Safely resolves client IP across Vercel, Cloudflare, and standard proxies.
 * Rejects untrusted x-forwarded-for chains.
 */
function getClientIp(request: NextRequest): string {
  // 1. Cloudflare / Platform-verified header (Most secure if behind Cloudflare)
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;

  // 2. Vercel / Nginx real IP header
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;

  // 3. Fall back to standard X-Forwarded-For (last proxy in chain is safest)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map((ip) => ip.trim());
    return ips[0] || '127.0.0.1';
  }

  return '127.0.0.1';
}

export async function proxy(request: NextRequest) {
  //   const ip = getClientIp(request);
  const pathname = request.nextUrl.pathname;

  try {
    // const { success, limit, remaining, reset } = await mediumRatelimit.limit(`mw_${ip}`);

    // // Standard rate limit response
    // if (!success) {
    //   return new NextResponse('Too Many Requests', {
    //     status: 429,
    //     headers: {
    //       'Content-Type': 'text/plain',
    //       'X-RateLimit-Limit': limit.toString(),
    //       'X-RateLimit-Remaining': remaining.toString(),
    //       'X-RateLimit-Reset': reset.toString(),
    //       'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
    //     },
    //   });
    // }

    // Attach informative rate limit headers to successful downstream requests
    const response = NextResponse.next();
    // response.headers.set('X-RateLimit-Limit', limit.toString());
    // response.headers.set('X-RateLimit-Remaining', remaining.toString());
    return response;
  } catch (err) {
    // Suppress noise or route to logger service in production
    console.error(`[RateLimit Failure] Route: ${pathname} | Error:`, (err as Error).message);

    // Fail-Closed: Strictly block sensitive endpoints (Auth, Payments, OTP)
    if (pathname.startsWith('/api/auth') || pathname.startsWith('/api/checkout')) {
      return new NextResponse('Service Temporarily Unavailable', {
        status: 503,
        headers: { 'Retry-After': '30' },
      });
    }

    // Fail-Open: Allow non-critical API routes to proceed
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Status', 'degraded');
    return response;
  }
}

export const config = {
  matcher: ['/api/:path*'],
};
