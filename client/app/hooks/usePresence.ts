import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

export function usePresence(userId: string | undefined, onUpdate: (data: any) => void) {
  useEffect(() => {
    if (!userId) return;

    // Connect to your NestJS backend
    const socket: Socket = io(process.env.PUBLIC_NEXT_FOUNDER_API_URL || 'http://localhost:4000', {
      query: { userId },
      transports: ['websocket'],
    });

    socket.on('userStatusUpdate', (data) => {
      console.log('Real-time status change:', data);
      onUpdate(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, onUpdate]);
}