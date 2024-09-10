/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IncomingMessage } from 'http'
import { Injectable, UnauthorizedException, type INestApplicationContext } from '@nestjs/common'
import { WsAdapter } from '@nestjs/platform-ws'
import { WebSocketServer } from 'ws'
import { AuthMiddleware } from '../auth/middleware/auth.middleware.js'

declare module 'http' {
  interface IncomingMessage {
    userUuid: string
  }
}

@Injectable()
export class AuthenticatedWsAdapter extends WsAdapter {
  private readonly authMiddleware: AuthMiddleware

  constructor (appOrHttpServer: INestApplicationContext) {
    super(appOrHttpServer)

    this.authMiddleware = appOrHttpServer.get(AuthMiddleware)
  }

  public override create (
    port: number,
    options?: Record<string, any> & {
      namespace?: string
      server?: any
      path?: string
    }
  ): any {
    const wss = super.create(port, options) as WebSocketServer

    wss.options.verifyClient = (
      info: { req: IncomingMessage },
      cb: (res: boolean, code?: number, message?: string, headers?: Record<string, string>) => void
    ): void => {
      const authHeaderParam = info.req.headers.authorization
      const authQueryParam = new URLSearchParams(info.req.url?.split('?')[1]).get('authorization')
      const authToken = authHeaderParam ?? authQueryParam

      if (authToken == null) {
        cb(false)
      } else {
        this.verifyAuthorization(authToken)
          .then((userUuid) => {
            info.req.userUuid = userUuid

            cb(true)
          })
          .catch(() => {
            cb(false)
          })
      }
    }

    return wss
  }

  private async verifyAuthorization (header: string): Promise<string> {
    const [bearer, token] = header.split(' ')

    if (bearer !== 'Bearer' || token == null) {
      throw new UnauthorizedException()
    }

    const payload = await this.authMiddleware.verify(token)

    return payload.uuid
  }
}
