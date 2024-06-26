/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable n/no-callback-literal */
import { type INestApplicationContext } from '@nestjs/common'
import { WsAdapter } from '@nestjs/platform-ws'
import { WsAuthGuard } from './guards/ws-auth.guard.js'

export class AuthenticatedWsAdapter extends WsAdapter {
  private readonly guard: WsAuthGuard

  constructor (appOrHttpServer: INestApplicationContext) {
    super(appOrHttpServer)

    this.guard = appOrHttpServer.get(WsAuthGuard)
  }

  public override create (
    port: number,
    options?: Record<string, any> & {
      namespace?: string
      server?: any
      path?: string
    }
  ): any {
    const wss = super.create(port, options)

    wss.options.verifyClient = (info, cb) => {
      const authHeaderParam = info.req.headers.authorization
      const authQueryParam = new URLSearchParams(info.req.url?.split('?')[1]).get('authorization')
      const authToken = authHeaderParam ?? authQueryParam

      if (authToken == null) {
        cb(false)
      } else {
        this.guard.verifyAuthorization(
          authToken
        )
          .then(_token => {
            cb(true)
          })
          .catch(_error => {
            cb(false)
          })
      }
    }

    return wss
  }
}
