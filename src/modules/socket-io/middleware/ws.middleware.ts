import type { Socket } from 'socket.io'
import { Injectable } from '@nestjs/common'
import { WsAuthGuard } from '../guards/ws-auth.guard.js'

export interface SocketIOMiddleware {
  (event: Socket, next: (err?: Error) => void)
}

@Injectable()
export class SocketAuthMiddleware {
  constructor (private readonly wsAuthGuard: WsAuthGuard) {}

  getMiddleware (): SocketIOMiddleware {
    return async (client, next) => {
      try {
        await this.wsAuthGuard.validateToken(client)
        next()
      } catch (err) {
        next(err)
      }
    }
  }
}
