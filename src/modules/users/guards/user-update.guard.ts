import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Permission } from '../../permissions/permission.enum.js'
import { CacheService } from '../../cache/cache.service.js'
import { getAuthOrFail } from '../../auth/middleware/auth.middleware.js'

@Injectable()
export class UpdateUserGuard implements CanActivate {
  constructor (
    private readonly reflector: Reflector,
    private readonly cache: CacheService
  ) {}

  async canActivate (context: ExecutionContext): Promise<boolean> {
    const userUuid = getAuthOrFail().uid

    const { params } = context.switchToHttp().getRequest()

    if (userUuid === params.user) {
      return true
    } else {
      const userPermissions = await this.cache.getUserPermissions(userUuid)
      return userPermissions.includes(Permission.ADMIN)
    }
  }
}
