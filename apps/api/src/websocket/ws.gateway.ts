import {
  WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private onlineUsers = new Map<string, string>();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) this.onlineUsers.set(client.id, userId);
  }

  handleDisconnect(client: Socket) {
    this.onlineUsers.delete(client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: { room: string; content: string }) {
    this.server.to(payload.room).emit('message', {
      ...payload, senderId: client.id, createdAt: new Date(),
    });
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    this.server.to(room).emit('user-joined', { userId: client.id });
  }
}
