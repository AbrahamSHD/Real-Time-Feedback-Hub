import 'dotenv/config';
import http from 'http';
import { WebSocketServer } from 'ws';
import app from './app';
import pool from './config/db';

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));

  setInterval(() => {
    ws.send('Hola desde el servidor');
  }, 2000);
});

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