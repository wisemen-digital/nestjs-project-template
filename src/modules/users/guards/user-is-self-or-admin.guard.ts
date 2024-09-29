import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { Permission } from '../../permissions/permission.enum.js'
import { CacheService } from '../../cache/cache.service.js'
import { getAuthOrFail } from '../../auth/middleware/auth.middleware.js'

@Injectable()
export class UserIsSelfOrAdminGuard implements CanActivate {
  constructor (
    private readonly cache: CacheService
  ) {}

  async canActivate (context: ExecutionContext): Promise<boolean> {
    const userUuid = getAuthOrFail().uuid
    const { params } = context.switchToHttp().getRequest<Request>()

    if (userUuid === params.user) {
      return true
    } else {
      const userPermissions = await this.cache.getUserPermissions(userUuid)

      return userPermissions.includes(Permission.ADMIN)
    }
  }
}
