import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UpdateCanvasDto } from '../canvas/dto/update-canvas.dto';

@WebSocketGateway({
  cors: {
    origin: process.env.clientUrl,
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('Websocket started');
  }

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.server.disconnectSockets(true);
  }

  @SubscribeMessage('updatedPixel')
  handleUpdatedPixel(@MessageBody() data: UpdateCanvasDto) {
    this.server.emit('updatedPixel', data);
  }
}
