import { AsyncLocalStorage } from 'async_hooks'
import { Injectable, type NestMiddleware } from '@nestjs/common'
import type { Request, Response, NextFunction } from 'express'
import type { AccessTokenInterface } from '../entities/accesstoken.entity.js'
import { AuthService } from '../services/auth.service.js'
import { KnownError } from '../../../utils/exceptions/errors.js'

const authStorage = new AsyncLocalStorage<AccessTokenInterface>()

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor (
    private readonly authService: AuthService
  ) {}

  public async use (req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.headers.authorization == null) {
      next()

      return
    }

    try {
      const authentication = await this.authService.authenticate(req, res)

      authStorage.run(authentication, () => {
        next()
      })
    } catch (_error) {
      next()
    }
  }
}

export function getAuthOrFail (): AccessTokenInterface {
  const token = authStorage.getStore()

  if (token == null) {
    throw new KnownError('unauthorized')
  }

  return token
}
