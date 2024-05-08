import { randUuid } from '@ngneat/falso'
import { Role } from '../../../entities/role.entity.js'
import { type Permission } from '../../../../permissions/permission.enum.js'

export class RoleEntityBuilder {
  private roleEntity: Role

  constructor () {
    this.reset()
  }

  reset (): this {
    this.roleEntity = new Role()

    this.roleEntity.uuid = randUuid()
    this.roleEntity.name = 'test-role'
    this.roleEntity.permissions = []

    return this
  }

  withUuid (uuid: string): this {
    this.roleEntity.uuid = uuid
    return this
  }

  withName (name: string): this {
    this.roleEntity.name = name
    return this
  }

  withPermissions (permissions: Permission[]): this {
    this.roleEntity.permissions = permissions
    return this
  }

  build (): Role {
    const result = this.roleEntity

    this.reset()

    return result
  }
}
