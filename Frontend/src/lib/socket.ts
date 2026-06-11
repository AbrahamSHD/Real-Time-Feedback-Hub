type WebSocketEventCallback = (data: any) => void;

interface Listeners {
  [event: string]: WebSocketEventCallback[];
}

let socket: WebSocket | null = null;
const listeners: Listeners = {};

export function initSocket() {
  // Prevent multiple connections
  if (socket && (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN)) {
    return;
  }

  socket = new WebSocket('ws://localhost:3000');

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      const { type, payload } = data;
      
      if (type && listeners[type]) {
        listeners[type].forEach(cb => cb(payload));
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  socket.onerror = (error) => {
    console.error('WebSocket Error:', error);
  };
  
  socket.onclose = () => {
    console.log('WebSocket connection closed.');
    socket = null;
  };
}

export function subscribeToEvent(event: string, callback: WebSocketEventCallback) {
  if (!listeners[event]) {
    listeners[event] = [];
  }
  listeners[event].push(callback);

  // Return a cleanup/unsubscribe function
  return () => {
    listeners[event] = listeners[event].filter(cb => cb !== callback);
  };
}

export function disconnectSocket() {
  if (socket) {
    socket.close();
    socket = null;
  }
}
