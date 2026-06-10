import 'dotenv/config'
import http from 'http'
import { WebSocketServer } from 'ws'
import app from './app'

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'

const server = http.createServer(app)
const wss = new WebSocketServer({ server })

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'))

  setInterval(() => {
    ws.send('Hola desde el servidor')
  }, 2000)
});

server.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`)
  console.log(`WS running on ${HOST}:${PORT}`)
});