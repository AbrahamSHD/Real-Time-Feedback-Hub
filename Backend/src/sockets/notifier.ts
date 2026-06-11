import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

let wss: WebSocketServer | null = null;

export const initWebSocketServer = (server: Server): WebSocketServer => {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });

    ws.on('error', (err) => {
      console.error('WebSocket client error:', err);
    });
  });

  return wss;
};

export const broadcast = (event: string, payload: any): void => {
  if (!wss) {
    console.warn('WebSocket server is not initialized yet.');
    return;
  }

  const messageStr = JSON.stringify({ event, payload });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
};
