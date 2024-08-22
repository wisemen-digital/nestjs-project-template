import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common'
import { Permission } from '../../permissions/permission.enum.js'
import { CacheService } from '../../cache/cache.service.js'
import { getAuthOrFail } from '../../auth/middleware/auth.middleware.js'

@Injectable()
export class UserSelfOrAdminGuard implements CanActivate {
  constructor (
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
