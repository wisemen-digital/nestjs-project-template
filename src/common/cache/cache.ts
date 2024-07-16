import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { Permission } from '../../modules/permissions/permission.enum.js'
import { RoleRepository } from '../../modules/roles/repositories/role.repository.js'
import { UserRepository } from '../../modules/users/repositories/user.repository.js'

const prefix = `${process.env.NODE_ENV ?? 'local'}`

const rolePermissionsCache = `${prefix}:role-permissions-cache`
const userRoleCache = `${prefix}:user-role-cache`

@Injectable()
export class RedisCacheService {
  constructor (
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly roleRepository: RoleRepository,
    private readonly userRepository: UserRepository
  ) { }

  onModuleDestroy (): void {
    // @ts-expect-error not typed
    const client = this.cacheManager.store.getClient()
    client.quit()
  }

  async getRolePermissions (roleUuid?: string | null): Promise<Permission[]> {
    if (roleUuid == null) return []

    const result = await this.cacheManager.get(`${rolePermissionsCache}:${roleUuid}`)

    if (result != null) return JSON.parse(String(result)) as Permission[]

    const role = await this.roleRepository.findOneBy({ uuid: roleUuid })
    const permissions = role?.permissions ?? []

    await this.cacheManager.set(`${rolePermissionsCache}:${roleUuid}`, JSON.stringify(permissions))

    return permissions
  }

  async clearRolePermissions (roleUuid?: string): Promise<void> {
    if (roleUuid == null) {
      await this.cacheManager.del(rolePermissionsCache)
    } else {
      await this.cacheManager.del(`${rolePermissionsCache}:${roleUuid}`)
    }
  }

  async getUserRole (userUuid: string): Promise<string | null> {
    const result = await this.cacheManager.get(`${userRoleCache}:${userUuid}`)

    if (result != null) return JSON.parse(String(result))

    const staff = await this.userRepository.findOneBy({ uuid: userUuid })
    const roleUuid = staff?.roleUuid ?? null

    await this.cacheManager.set(`${userRoleCache}:${userUuid}`, JSON.stringify(staff?.roleUuid ?? null))

    return roleUuid
  }

  async clearUserRole (userUuid?: string): Promise<void> {
    if (userUuid == null) await this.cacheManager.del(userRoleCache)
    else await this.cacheManager.del(`${userRoleCache}:${userUuid}`)
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
