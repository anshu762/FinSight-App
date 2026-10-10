import { app } from './app.js';
import { env } from './config/env.js';

const HOST = '0.0.0.0';
const PORT = env.PORT;

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 FinSight Server running at http://${HOST}:${PORT}`);
  console.log(`🩺 Health check accessible at http://${HOST}:${PORT}/health`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
