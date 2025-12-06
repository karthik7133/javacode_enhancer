const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log('===========================================');
  console.log('  Java Code Analyzer API Server');
  console.log('===========================================');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Server running on: http://${HOST}:${PORT}`);
  console.log(`API Base URL: http://${HOST}:${PORT}/api`);
  console.log('===========================================');
  console.log('Available Endpoints:');
  console.log(`  GET  /api/health          - Health check`);
  console.log(`  POST /api/analyze         - Analyze Java code`);
  console.log(`  POST /api/format          - Format Java code`);
  console.log(`  POST /api/analyze/upload  - Upload & analyze .java file`);
  console.log('===========================================');
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

module.exports = server;
