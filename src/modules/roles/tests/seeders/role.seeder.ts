import { type EntityManager } from 'typeorm'
import { type Role } from '../../entities/role.entity.js'
import { RoleRepository } from '../../repositories/role.repository.js'
import { Permission } from '../../../permissions/enums/permission.enum.js'
import { AbstractSeeder } from '../../../../../test/seeders/abstract-seeder.js'

export class RoleSeeder extends AbstractSeeder<Role> {
  constructor (manager: EntityManager) {
    super(new RoleRepository(manager))
  }

  async seedAdminRole (): Promise<Role> {
    const role = await this.findRoleByName('admin')

    if (role !== null) {
      return role
    }

    return await this.seedRole('admin', [Permission.ADMIN])
  }

  async seedReadonlyRole (): Promise<Role> {
    const role = await this.findRoleByName('readonly')

    if (role !== null) {
      return role
    }

    return await this.seedRole('readonly', [Permission.READ_ONLY])
  }

  async seedUserRole (): Promise<Role> {
    const role = await this.findRoleByName('user')

    if (role !== null) {
      return role
    }

    const userPermissions = [
      Permission.USER_READ,
      Permission.USER_UPDATE,
      Permission.USER_DELETE
    ]
    return await this.seedRole('user', userPermissions)
  }

  private async findRoleByName (name: string): Promise<Role | null> {
    return await this.repository.findOneBy({ name })
  }

  private async seedRole (name: string, permissions: Permission[]): Promise<Role> {
    const role = this.repository.create({
      name,
      permissions
    })

    return await this.repository.save(role)
  }
}
