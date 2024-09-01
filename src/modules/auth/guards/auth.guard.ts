import {
  type CanActivate,
  type ExecutionContext,
  Injectable
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '../../permissions/permissions.decorator.js'
import { getAuthOrFail } from '../middleware/auth.middleware.js'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (
    private readonly reflector: Reflector
  ) {}

  canActivate (context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic) {
      return true
    }

    getAuthOrFail()

    return true
  }
}
