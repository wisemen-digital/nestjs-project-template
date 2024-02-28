import {
  type CanActivate,
  type ExecutionContext,
  Injectable
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '../../permissions/permissions.decorator.js'
import { type AccessTokenInterface } from '../entities/accesstoken.entity.js'
import { AuthService } from '../services/auth.service.js'
import { KnownError } from '../../../utils/Exceptions/errors.js'

export interface Request {
  auth: AccessTokenInterface
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (
    private readonly authService: AuthService,
    private readonly reflector: Reflector
  ) {}

  async canActivate (context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse()

    try {
      const authentication = await this.authService.authenticate(request, response)
      request.auth = authentication

      return true
    } catch (error) {
      throw new KnownError('unauthorized')
    }
  }
}
