import type { EntityManager } from 'typeorm'
import type { Role } from '../../entities/role.entity.js'
import { RoleRepository } from '../../repositories/role.repository.js'
import { Permission } from '../../../permissions/permission.enum.js'
import { AbstractSeeder } from '../../../../../test/seeders/abstract-seeder.js'

export class RoleSeeder extends AbstractSeeder<Role> {
  constructor (manager: EntityManager) {
    super(new RoleRepository(manager))
  }

  async seedAdminRole (): Promise<Role> {
    return await this.findRoleByName('admin')
      ?? await this.seedRole('admin', [Permission.ADMIN])
  }

  async seedReadonlyRole (): Promise<Role> {
    return await this.findRoleByName('readonly')
      ?? await this.seedRole('readonly', [Permission.READ_ONLY])
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
