import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { RedisCacheService } from '../../utils/cache/cache.js'
import { Permission } from './permission.enum.js'
import { PERMISSIONS_KEY } from './permissions.decorator.js'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor (
    private readonly reflector: Reflector,
    private readonly cache: RedisCacheService
  ) {}

  async canActivate (context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (requiredPermissions == null) {
      return true
    }

    const { auth } = context.switchToHttp().getRequest()

    if (auth.user != null) {
      const userPermissions = await this.cache.getUserPermissions(auth.user.uuid)

      if (
        requiredPermissions.every(permission => userPermissions.includes(permission)) ||
        userPermissions.includes(Permission.ADMIN)
      ) {
        return true
      }
    }

    return false
  }
}
