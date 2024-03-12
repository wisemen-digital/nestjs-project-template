import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { RedisCacheService } from '../../../utils/cache/cache.js'
import { Permission } from '../../permissions/permission.enum.js'

@Injectable()
export class UpdateUserGuard implements CanActivate {
  constructor (
    private readonly reflector: Reflector,
    private readonly cache: RedisCacheService
  ) {}

  async canActivate (context: ExecutionContext): Promise<boolean> {
    const { auth, params } = context.switchToHttp().getRequest()

    const userPermissions = await this.cache.getUserPermissions(auth.user.uuid)

    return auth.user.uuid === params.user || userPermissions.includes(Permission.ADMIN)
  }
}
