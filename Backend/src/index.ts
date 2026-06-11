import 'dotenv/config';
import http from 'http';
import app from './app';
import pool from './config/db';
import { initWebSocketServer } from './sockets/notifier';

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

const server = http.createServer(app);

// Initialize WebSocket server with our notifier logic
initWebSocketServer(server);

// Test database connection
pool.query('SELECT NOW()')
  .then((res) => {
    console.log(`Database connected successfully at: ${res.rows[0].now}`);
    server.listen(PORT, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
      console.log(`WS running on ${HOST}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });