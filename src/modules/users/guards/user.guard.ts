import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { CacheService } from '../../cache/services/cache.service.js'
import { Permission } from '../../permissions/enums/permission.enum.js'

@Injectable()
export class UserGuard implements CanActivate {
  constructor (
    private readonly reflector: Reflector,
    private readonly cache: CacheService
  ) {}

  async canActivate (context: ExecutionContext): Promise<boolean> {
    const { auth, params } = context.switchToHttp().getRequest()
    const authUuid = auth.user.uuid
    const paramsUuid = params.userUuid

    if (authUuid === paramsUuid) {
      return true
    }

    const userPermissions = await this.cache.getUserPermissions(authUuid)
    if (userPermissions.includes(Permission.ADMIN)) {
      return true
    }

    return false
  }
}
