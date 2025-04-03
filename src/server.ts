import app from './app';
import config from './config';
import http from 'http';

const PORT = Number(config.port) || 5000;
const HOST = '0.0.0.0';

const server = http.createServer(app).listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

process.on('unhandledRejection', (error) => {
  console.log('Unhandled Rejection:', error);
  server.close(() => {
    process.exit(1);
  });
});
