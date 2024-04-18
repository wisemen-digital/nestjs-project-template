import { Injectable } from '@nestjs/common'
import { ILike, type DeepPartial } from 'typeorm'
import { type SeederOptions } from '../../../../test/utils/seeder-options.js'
import { type Role } from '../entities/role.entity.js'
import { RoleRepository } from '../repositories/role.repository.js'
import { Permission } from '../../permissions/permission.enum.js'
import { type CreateRoleDto } from '../dtos/create-role.dto.js'

export interface RoleSeederOptions extends SeederOptions {
  name: string
  permissions?: Permission[] | null
}

@Injectable()
export class RoleSeeder {
  constructor (
    private readonly roleRepository: RoleRepository
  ) {}

  async createRandomRole (options: RoleSeederOptions): Promise<Role> {
    const role = this.roleRepository.create({
      name: options?.name,
      permissions: options?.permissions ?? []
    })

    await this.roleRepository.save(role)

    return role
  }

  async createRandomRoleDto (options: RoleSeederOptions): Promise<DeepPartial<CreateRoleDto>> {
    const dto: DeepPartial<CreateRoleDto> = {
      name: options?.name
    }

    return dto
  }

  async createAdminRole (): Promise<Role> {
    const adminRole = await this.roleRepository.findOne({
      where: { name: ILike('admin') }
    })

    if (adminRole != null) return adminRole

    const role = this.roleRepository.create({
      name: 'admin',
      permissions: [Permission.ADMIN]
    })

    await this.roleRepository.save(role)

    return role
  }

  async createReadonlyRole (): Promise<Role> {
    const readOnlyRole = await this.roleRepository.findOne({
      where: { name: ILike('readonly') }
    })

    if (readOnlyRole != null) return readOnlyRole

    const role = this.roleRepository.create({
      name: 'readonly',
      permissions: [Permission.READ_ONLY]
    })

    await this.roleRepository.save(role)

    return role
  }

  createRandomName (): string {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-'
    const randomCharacters =
      Array.from({ length: 100 }, () => characters[Math.floor(Math.random() * characters.length)])
    return randomCharacters.join('')
  }

  createRandomEmail (): string {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const randomCharacters =
      Array.from({ length: 30 }, () => characters[Math.floor(Math.random() * characters.length)])
    return randomCharacters.join('') + '@test.com'
  }
}
