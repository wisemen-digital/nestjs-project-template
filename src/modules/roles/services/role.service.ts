import { Injectable } from '@nestjs/common'
import { DataSource, In } from 'typeorm'
import { RoleRepository } from '../repositories/role.repository.js'
import { type Role } from '../entities/role.entity.js'
import { type CreateRoleDto } from '../dtos/create-role.dto.js'
import { UserRepository } from '../../users/repositories/user.repository.js'
import { KnownError } from '../../../utils/Exceptions/errors.js'
import { RedisCacheService } from '../../../utils/cache/cache.js'
import { type UpdateRolesBulkDto } from '../dtos/update-roles-bulk.dto.js'

@Injectable()
export class RoleService {
  constructor (
    private readonly dataSource: DataSource,
    private readonly roleRepository: RoleRepository,
    private readonly userRepository: UserRepository,
    private readonly cache: RedisCacheService
  ) {}

  async findAll (): Promise<Role[]> {
    return await this.roleRepository.find()
  }

  async findOne (uuid: string): Promise<Role> {
    return await this.roleRepository.findOneOrFail({
      where: { uuid }
    })
  }

  async create (dto: CreateRoleDto): Promise<Role> {
    let role = await this.findByName(dto.name)
    if (role != null) throw new KnownError('already_exists').setDesc('Role already exists')

    await this.roleRepository.insert(dto)

    role = await this.findByName(dto.name)

    if (role == null) throw new KnownError('not_found')

    return role
  }

  async update (uuid: string, dto: CreateRoleDto): Promise<Role> {
    const exists = await this.findByName(dto.name)
    if (exists != null) throw new KnownError('already_exists').setDesc('Role already exists')

    await this.roleRepository.update(uuid, dto)

    const role = await this.findOne(uuid)

    return role
  }

  async updateBulk (dto: UpdateRolesBulkDto): Promise<Role[]> {
    await this.dataSource.transaction(async manager => {
      return await new RoleRepository(manager).upsert(dto.roles, { conflictPaths: { uuid: true } })
    })

    await this.cache.clearRolePermissions()

    return await this.roleRepository.findBy({
      uuid: In(dto.roles.map(role => role.uuid))
    })
  }

  async delete (uuid: string): Promise<void> {
    const role = await this.findOne(uuid)

    if (role.name === 'admin' || role.name === 'readonly') {
      throw new KnownError('not_editable').setDesc('Cannot delete this role')
    }

    const readOnlyRole = await this.roleRepository.findOneOrFail({
      where: { name: 'readonly' }
    })

    const users = await this.userRepository.find({
      where: { roleUuid: role.uuid }
    })

    await this.dataSource.transaction(async manager => {
      await Promise.all(users.map(async user => {
        user.roleUuid = readOnlyRole.uuid

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        new UserRepository(manager).update({ roleUuid: uuid }, { roleUuid: readOnlyRole.uuid })
      }))

      await manager.remove(role)
    })

    await this.cache.clearRolePermissions(uuid)
  }

  async count (uuid: string): Promise<number> {
    return await this.userRepository.count({
      where: { roleUuid: uuid }
    })
  }

  private async findByName (name: string): Promise<Role | null> {
    return await this.roleRepository.findOne({
      where: { name }
    })
  }
}
