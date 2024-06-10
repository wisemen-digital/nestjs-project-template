/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Logger } from '@nestjs/common'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Namespace, type Socket } from 'socket.io'
import { SocketAuthMiddleware } from '../middleware/ws.middleware.js'
import { type RedisExampleType } from '../../redis/redis-client.js'

@WebSocketGateway({
  namespace: 'events',
  cors: {
    origin: process.env.CORS_ORIGIN
  }
})
@Injectable()
export class EventsGateway {
  constructor (private readonly socketAuthMiddleware: SocketAuthMiddleware) {}

  @WebSocketServer() io: Namespace

  private readonly logger = new Logger(EventsGateway.name)

  afterInit (client: Socket): void {
    client.use(this.socketAuthMiddleware.getMiddleware() as any)
    this.logger.log('Websocket Gateway Initialized')
  }

  handleConnection (): void {}

  handleDisconnect (): void {}

  sendExample (_example: RedisExampleType): void {
    // TODO: Implement
  }
}
