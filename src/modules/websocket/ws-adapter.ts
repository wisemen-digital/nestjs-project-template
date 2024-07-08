/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable n/no-callback-literal */
import { type IncomingMessage } from 'http'
import { Injectable, UnauthorizedException, type INestApplicationContext } from '@nestjs/common'
import { WsAdapter } from '@nestjs/platform-ws'
import { TokenService } from '../auth/services/token.service.js'
import { UserService } from '../users/services/user.service.js'

declare module 'http' {
  interface IncomingMessage {
    userUuid: string
  }
}

@Injectable()
export class AuthenticatedWsAdapter extends WsAdapter {
  private readonly tokenService: TokenService
  private readonly userService: UserService

  constructor (appOrHttpServer: INestApplicationContext) {
    super(appOrHttpServer)

    this.tokenService = appOrHttpServer.get(TokenService)
    this.userService = appOrHttpServer.get(UserService)
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

    wss.options.verifyClient = async (
      info: { req: IncomingMessage },
      cb: (res: boolean, code?: number, message?: string, headers?: Record<string, string>) => void
    ) => {
      const authHeaderParam = info.req.headers.authorization
      const authQueryParam = new URLSearchParams(info.req.url?.split('?')[1]).get('authorization')
      const authToken = authHeaderParam ?? authQueryParam

      if (authToken == null) {
        cb(false)
      } else {
        try {
          const userUuid = await this.verifyAuthorization(authToken)
          info.req.userUuid = userUuid
          cb(true)
        } catch (error) {
          cb(false)
        }
      }
    }

    return wss
  }

  private async verifyAuthorization (header: string | null): Promise<string> {
    if (header == null) {
      throw new UnauthorizedException()
    }

    const [bearer, token] = header.split(' ')

    if (bearer !== 'Bearer' || token == null) {
      throw new UnauthorizedException()
    }

    const isAuthorized = await this.tokenService.getAccessToken(token)
    if (isAuthorized === false) {
      throw new UnauthorizedException()
    }

    const user = await this.userService.findOne(isAuthorized.uid)
    if (user == null) {
      throw new UnauthorizedException()
    }

    return isAuthorized.uid
  }
}
