import {
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Founder } from '../founder/entities/founder.entity';

@WebSocketGateway({ 
    cors: {
    origin: '*',
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class PresenceGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(
        @InjectModel(Founder.name) private founderModel: Model<Founder>
    ) {}

    async handleConnection(client: Socket) {
        const userId = client.handshake.query.userId as string;
        console.log(`Connection attempt: ${userId}`);

        if (!userId || userId === 'undefined') {
            console.log('Connection attempt without valid userId');
            return;
        }

        const now = new Date();

        await this.founderModel.findByIdAndUpdate(userId, {
            isOnline: true,
            lastActive: now,
        });

        this.server.emit('userStatusUpdate', { userId, isOnline: true, lastActive: now });
    }

    async handleDisconnect(client: Socket) {
        const userId = client.handshake.query.userId as string;
        
        if (!userId || userId === 'undefined') return;

        const lastSeen = new Date();
        try {
            await this.founderModel.findByIdAndUpdate(userId, {
                isOnline: false,
                lastActive: lastSeen,
            });

            // FIX: Match the event name "userStatusUpdate" used in your React hook
            this.server.emit('userStatusUpdate', { 
                userId, 
                isOnline: false, 
                lastSeen: lastSeen 
            });
        } catch (e) {
            console.error('Error updating presence:', e);
        }
    }
}