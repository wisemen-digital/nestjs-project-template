import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common'
import type { Socket } from 'socket.io'
import { KnownError } from '../../../utils/Exceptions/errors.js'
import { ExecutionContextType } from '../../../types/enums/ExecutionContext.js'
import { UserService } from '../../users/services/user.service.js'
import { TokenService } from '../../auth/services/token.service.js'

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor (
    private readonly tokenService: TokenService,
    private readonly userService: UserService
  ) {}

  async canActivate (
    context: ExecutionContext
  ): Promise<boolean> {
    if (context.getType() !== ExecutionContextType.WEBSOCKET) {
      return true
    }

    const client = context.switchToWs().getClient()
    return await this.validateToken(client)
  }

  async validateToken (client: Socket): Promise<boolean> {
    try {
      const token = client.handshake.auth.accessToken
      if (token == null) {
        throw new KnownError('unauthorized')
      }
      const decoded = await this.tokenService.getAccessToken(token)
      if (decoded === false) {
        throw new KnownError('unauthorized')
      }
      const user = await this.userService.findOne(decoded.uid)
      if (user == null) {
        throw new KnownError('unauthorized')
      }
    } catch (error) {
      throw new Error('unauthorized')
    }

    return true
  }
}
