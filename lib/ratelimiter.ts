// import { Ratelimit } from '@upstash/ratelimit';
// import { Redis } from '@upstash/redis';

// // Ephemeral cache stores blocked keys in memory on warm serverless/lambda instances
// const ephemeralCache = new Map();
// const redis = Redis.fromEnv();

// // Common configuration options
// const baseConfig = {
//   redis,
//   ephemeralCache,
//   timeout: 1000, // Fail-open (1s deadline)
//   analytics: true,
// };

// /**
//  * 1. Short Window (5 Seconds)
//  * Best for: High-frequency bursts, spam prevention on real-time features (chat, voting, search typeahead).
//  */
// export const shortRatelimit = new Ratelimit({
//   ...baseConfig,
//   limiter: Ratelimit.slidingWindow(5, '5 s'), // 5 requests per 5 seconds
//   prefix: 'ratelimit:short',
// });

// /**
//  * 2. Medium Window (15 Seconds)
//  * Best for: Standard API endpoints, database-heavy reads, user action buttons (comments, likes).
//  */
// export const mediumRatelimit = new Ratelimit({
//   ...baseConfig,
//   limiter: Ratelimit.slidingWindow(15, '15 s'), // 15 requests per 15 seconds
//   prefix: 'ratelimit:medium',
// });

// /**
//  * 3. Long Window (50 Seconds / ~1 Minute)
//  * Best for: Sensitive mutations, form submissions, password resets, payment attempts.
//  */
// export const longRatelimit = new Ratelimit({
//   ...baseConfig,
//   limiter: Ratelimit.slidingWindow(50, '50 s'), // 50 requests per 50 seconds
//   prefix: 'ratelimit:long',
// });

// /**
//  * 4. Extended Window (100 Seconds / ~1.5 Minutes)
//  * Best for: Auth/Login protection, OTP dispatching, expensive AI / LLM generation endpoints.
//  */
// export const extendedRatelimit = new Ratelimit({
//   ...baseConfig,
//   limiter: Ratelimit.slidingWindow(100, '100 s'), // 100 requests per 100 seconds
//   prefix: 'ratelimit:extended',
// });
