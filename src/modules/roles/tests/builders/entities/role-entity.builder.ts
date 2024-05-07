import { randUuid } from '@ngneat/falso'
import { Role } from '../../../entities/role.entity.js'
import { type Permission } from '../../../../permissions/permission.enum.js'

export class RoleEntityBuilder {
  private readonly roleEntity: Role = new Role()

  constructor () {
    this.roleEntity.uuid = randUuid()
    this.roleEntity.createdAt = new Date()
    this.roleEntity.updatedAt = new Date()
    this.roleEntity.name = 'test-role'
  }

  withUuid (uuid: string): RoleEntityBuilder {
    this.roleEntity.uuid = uuid
    return this
  }

  withName (name: string): RoleEntityBuilder {
    this.roleEntity.name = name
    return this
  }

  withPermissions (permissions: Permission[]): RoleEntityBuilder {
    this.roleEntity.permissions = permissions
    return this
  }

  build (): Role {
    return this.roleEntity
  }
}
