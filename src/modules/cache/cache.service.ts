import { Injectable } from '@nestjs/common'
import { RoleRepository } from '../roles/repositories/role.repository.js'
import { UserRepository } from '../users/repositories/user.repository.js'
import { Permission } from '../permissions/permission.enum.js'
import { RedisClient } from '../redis/redis.client.js'

const prefix = `${process.env.NODE_ENV ?? 'local'}`

const rolePermissionsCache = `${prefix}.role-permissions-cache`
const userRoleCache = `${prefix}.user-role-cache`

@Injectable()
export class CacheService {
  constructor (
    // private readonly client: NatsClient,
    private readonly client: RedisClient,
    private readonly roleRepository: RoleRepository,
    private readonly userRepository: UserRepository
  ) {

  }

  async getRolePermissions (roleUuid?: string | null): Promise<Permission[]> {
    if (roleUuid == null) return []

    const result = await this.client.getCachedValue(`${rolePermissionsCache}.${roleUuid}`)

    if (result != null) {
      return JSON.parse(String(result)) as Permission[]
    }

    const role = await this.roleRepository.findOneBy({ uuid: roleUuid })
    const permissions = role?.permissions ?? []

    await this.client.putCachedValue(`${rolePermissionsCache}.${roleUuid}`, JSON.stringify(permissions))

    return permissions
  }

  async clearRolePermissions (roleUuid?: string): Promise<void> {
    if (roleUuid == null) {
      await this.client.deleteCachedValue(rolePermissionsCache)
    } else {
      await this.client.deleteCachedValue(`${rolePermissionsCache}.${roleUuid}`)
    }
  }

  async getUserRole (userUuid: string): Promise<string | null> {
    const result = await this.client.getCachedValue(`${userRoleCache}.${userUuid}`)

    if (result != null) {
      return JSON.parse(String(result))
    }

    const user = await this.userRepository.findOneBy({ uuid: userUuid })
    const roleUuid = user?.roleUuid ?? null

    await this.client.putCachedValue(`${userRoleCache}.${userUuid}`, JSON.stringify(user?.roleUuid ?? null))

    return roleUuid
  }

  async clearUserRole (userUuid?: string): Promise<void> {
    if (userUuid == null) await this.client.deleteCachedValue(userRoleCache)
    else await this.client.deleteCachedValue(`${userRoleCache}.${userUuid}`)
  }

  async getUserPermissions (userUuid: string): Promise<Permission[]> {
    const roleUuid = await this.getUserRole(userUuid)
    const permissions = await this.getRolePermissions(roleUuid)

    return permissions
  }

  async hasAdminPermission (userUuid: string): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userUuid)

    return userPermissions.includes(Permission.ADMIN)
  }

  async hasPermission (userUuid: string, permissions: Permission[]): Promise<boolean> {
    const hasAdminPermission = await this.hasAdminPermission(userUuid)
    const userPermissions = await this.getUserPermissions(userUuid)

    return (
      hasAdminPermission ||
      permissions.length === 0 ||
      permissions.some(permission => userPermissions.includes(permission))
    )
  }
}
