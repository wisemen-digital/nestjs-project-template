import { Injectable } from '@nestjs/common'
import { RedisClient } from '../../redis/redis.client.js'
import { RoleRepository } from '../../roles/repositories/role.repository.js'
import { UserRepository } from '../../users/repositories/user.repository.js'
import { Permission } from '../../permissions/enums/permission.enum.js'

const prefix = `${process.env.NODE_ENV ?? 'local'}`

const rolePermissionsCache = `${prefix}.role-permissions-cache`
const userRoleCache = `${prefix}.user-role-cache`

@Injectable()
export class CacheService {
  constructor (
    private readonly client: RedisClient,
    private readonly roleRepository: RoleRepository,
    private readonly userRepository: UserRepository
  ) {

  }

  async getRolePermissions (roleUuid: string | null): Promise<Permission[]> {
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

  async clearRolesPermissions (roleUuids: string[]): Promise<void> {
    for (const roleUuid of roleUuids) {
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

  async clearUserRole (userUuid: string): Promise<void> {
    await this.client.deleteCachedValue(`${userRoleCache}.${userUuid}`)
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

  async hasPermissions (userUuid: string, permissions: Permission[]): Promise<boolean> {
    if (permissions.length === 0) {
      return true
    }

    const hasAdminPermission = await this.hasAdminPermission(userUuid)
    if (hasAdminPermission) {
      return true
    }

    const userPermissions = await this.getUserPermissions(userUuid)
    return permissions.some(permission => userPermissions.includes(permission))
  }
}
