// export async function register() {
//   if (process.env.NEXT_RUNTIME === 'nodejs') {
//     const { logger } = await import('./lib/logger');
//     const { testDbConnection, closeDb } = await import('./app/database/index');

//     const isProduction = process.env.NODE_ENV === 'production';
//     const driverLabel = isProduction ? 'Neon Cloud (HTTP)' : 'Local Postgres (Pool)';

//     logger.info('Initializing database connection check', { driverLabel });

//     const isConnected = await testDbConnection();

//     if (isConnected) {
//       logger.info(`[DB] Successfully connected to ${driverLabel}`);
//     } else {
//       logger.error(`[DB] Failed to connect to ${driverLabel} on server boot!`);
//     }

//     // Attach shutdown handlers for local development / Node servers
//     if (!isProduction) {
//       const handleShutdown = async (signal: string) => {
//         logger.info(`[DB] Received ${signal}. Closing database connection pool...`);
//         await closeDb();
//         process.exit(0);
//       };

//       // Ensure listeners are registered once
//       process.once('SIGINT', () => handleShutdown('SIGINT'));
//       process.once('SIGTERM', () => handleShutdown('SIGTERM'));
//     }
//   }
// }
