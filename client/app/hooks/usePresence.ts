import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

export function usePresence(userId: string | undefined, onUpdate: (data: any) => void) {
  useEffect(() => {
    console.log("Hook received userId:", userId);
    if (!userId || userId === 'undefined') {
        console.log("Presence: Waiting for valid userId...");
        return;
    }

    console.log("Presence: Connecting for user", userId);

    const socket: Socket = io(process.env.NEXT_PUBLIC_FOUNDER_API_URL || 'http://localhost:4000', {
      query: { userId },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log("Presence: Connected to server");
    });

    socket.on('connect_error', (err) => {
      console.error("Presence: Connection error", err.message);
    });

    socket.on('userStatusUpdate', (data) => {
      onUpdate(data);
    });

    return () => {
      console.log("Presence: Disconnecting...");
      socket.disconnect();
    };
  }, [userId, onUpdate]);
}