import { io, Socket } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined.');
}

/**
 * Singleton socket — NOT auto-connected.
 * Call socket.connect() explicitly after setting socket.auth.
 * This prevents connections from firing before the user is authenticated.
 */
export const socket: Socket = io(API_URL, {
  autoConnect: false,
  withCredentials: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
  timeout: 10_000,
});

// Dev-only connection logging
if (process.env.NODE_ENV === 'development') {
  socket.on('connect', () => console.log('[socket] connected', socket.id));
  socket.on('disconnect', (reason) => console.log('[socket] disconnected', reason));
  socket.on('connect_error', (err) => console.error('[socket] error', err.message));
}