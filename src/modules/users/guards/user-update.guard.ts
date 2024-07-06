import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Permission } from '../../permissions/permission.enum.js'
import { CacheService } from '../../cache/cache.service.js'

@Injectable()
export class UpdateUserGuard implements CanActivate {
  constructor (
    private readonly reflector: Reflector,
    private readonly cache: CacheService
  ) {}

  async canActivate (context: ExecutionContext): Promise<boolean> {
    const { auth, params } = context.switchToHttp().getRequest()

    const userPermissions = await this.cache.getUserPermissions(auth.user.uuid)

    return auth.user.uuid === params.user || userPermissions.includes(Permission.ADMIN)
  }
}
