import { AsyncLocalStorage } from 'async_hooks'
import { Injectable, type NestMiddleware } from '@nestjs/common'
import type { Request, Response, NextFunction } from 'express'
import { createRemoteJWKSet, jwtVerify } from 'jose'
import { ConfigService } from '@nestjs/config'
import { UnauthorizedError } from '../../exceptions/generic/unauthorized.error.js'
import { AuthContent, UserAuthService } from '../../users/services/user-auth.service.js'

interface TokenContent {
  sub: string
}

const authStorage = new AsyncLocalStorage<AuthContent>()

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly jwks: ReturnType<typeof createRemoteJWKSet>

  constructor (
    private readonly configService: ConfigService,
    private readonly userAuthService: UserAuthService
  ) {
    this.jwks = createRemoteJWKSet(
      new URL(this.configService.getOrThrow('AUTH_JWKS_ENDPOINT'))
    )
  }

  public async use (req: Request, _res: Response, next: NextFunction): Promise<void> {
    if (req.headers.authorization == null) {
      next()

      return
    }

    const token = req.headers.authorization.split(' ')[1]

    try {
      const content = await this.verify(token)

      authStorage.run(content, () => {
        next()
      })
    } catch (_error) {
      next()
    }
  }

  public async verify (token: string): Promise<AuthContent> {
    const { payload } = await jwtVerify<TokenContent>(token, this.jwks, {
      audience: this.configService.getOrThrow('AUTH_AUDIENCE')
    })

    return await this.userAuthService.findOneBySub(payload.sub)
  }
}

export function getAuthOrFail (): AuthContent {
  const token = authStorage.getStore()

  if (token == null) {
    throw new UnauthorizedError()
  }

  return token
}
