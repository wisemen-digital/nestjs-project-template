import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Permission } from '../../permissions/enums/permission.enum.js'
import { RedisCacheService } from '../../cache/services/cache.service.js'

@Injectable()
export class UpdateUserGuard implements CanActivate {
  constructor (
    private readonly reflector: Reflector,
    private readonly cache: RedisCacheService
  ) {}

  async canActivate (context: ExecutionContext): Promise<boolean> {
    const { auth, params } = context.switchToHttp().getRequest()

    if (auth.user.uuid === params.user) {
      return true
    } else {
      const userPermissions = await this.cache.getUserPermissions(auth.user.uuid)
      return userPermissions.includes(Permission.ADMIN)
    }
  }
}

export class DeleteUserGuard extends UpdateUserGuard {}
