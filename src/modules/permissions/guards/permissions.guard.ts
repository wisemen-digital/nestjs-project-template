import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { CacheService } from '../../cache/services/cache.service.js'
import { type Permission } from '../enums/permission.enum.js'
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator.js'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor (
    private readonly reflector: Reflector,
    private readonly cache: CacheService
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
      return await this.cache.hasPermissions(auth.user.uuid, requiredPermissions)
    }

    return false
  }
}
