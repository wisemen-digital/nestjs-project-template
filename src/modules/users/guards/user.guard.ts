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

    if (auth.user.uuid === params.userUuid) {
      return true
    }

    const userPermissions = await this.cache.getUserPermissions(auth.user.uuid)
    if (userPermissions.includes(Permission.ADMIN)) {
      return true
    }

    return false
  }
}
