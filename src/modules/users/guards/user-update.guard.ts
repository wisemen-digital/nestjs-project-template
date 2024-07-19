import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common'
import { RedisCacheService } from '../../../common/cache/cache.js'
import { Permission } from '../../permissions/permission.enum.js'

@Injectable()
export class AllowSelfAndAdminsGuard implements CanActivate {
  constructor (
    private readonly cache: RedisCacheService
  ) {}

  async canActivate (context: ExecutionContext): Promise<boolean> {
    const { auth, params } = context.switchToHttp().getRequest()

    if (auth.user.uuid === params.userUuid) {
      return true
    } else {
      const userPermissions = await this.cache.getUserPermissions(auth.user.uuid)
      return userPermissions.includes(Permission.ADMIN)
    }
  }
}
