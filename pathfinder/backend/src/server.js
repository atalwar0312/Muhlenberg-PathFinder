import { createApp } from './app.js';
import { createSupabaseClient } from './supabase.js';

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST || '127.0.0.1';
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535');
}
const server = createApp(createSupabaseClient()).listen(port, host, () => {
  console.log(`PathFinder: http://${host}:${port}`);
});
server.on('error', err => {
  console.error(`Unable to start server: ${err.message}`);
  process.exitCode = 1;
});
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 5000).unref();
  });
}
