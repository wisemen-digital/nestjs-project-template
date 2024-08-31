import { Injectable } from '@nestjs/common'
import { DataSource, In } from 'typeorm'
import { RoleRepository } from '../repositories/role.repository.js'
import type { Role } from '../entities/role.entity.js'
import type { CreateRoleDto } from '../dtos/create-role.dto.js'
import { UserRepository } from '../../users/repositories/user.repository.js'
import type { UpdateRolesBulkDto } from '../dtos/update-roles-bulk.dto.js'
import { transaction } from '../../typeorm/utils/transaction.js'
import { CacheService } from '../../cache/cache.service.js'
import { PermissionTransformer } from '../../permissions/transformers/permission.transformer.js'
import { TypesenseCollectionName } from '../../typesense/enums/typesense-collection-index.enum.js'
import type { UpdateRoleTransformedType } from '../types/update-role-transformed.type.js'
import { TypesenseCollectionService } from '../../typesense/services/typesense-collection.service.js'
import { RoleNameAlreadyInUseError } from '../types/role-name-already-in-use.error.js'
import { RoleNotEditableError } from '../types/role-not-editable.error.js'
import { NotFoundError } from '../../exceptions/generic/not-found.error.js'

@Injectable()
export class RoleService {
  constructor (
    private readonly dataSource: DataSource,
    private readonly roleRepository: RoleRepository,
    private readonly userRepository: UserRepository,
    private readonly typesenseCollectionService: TypesenseCollectionService,
    private readonly cache: CacheService
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

    if (role != null) {
      throw new RoleNameAlreadyInUseError(dto.name)
    }

    await this.roleRepository.insert(dto)

    role = await this.findByName(dto.name)

    if (role == null) throw new NotFoundError('Role not found')

    return role
  }

  async update (uuid: string, dto: CreateRoleDto): Promise<Role> {
    const exists = await this.findByName(dto.name)

    if (exists != null) {
      throw new RoleNameAlreadyInUseError(dto.name)
    }

    await this.roleRepository.update(uuid, dto)

    const role = await this.findOne(uuid)

    return role
  }

  async updateBulk (dto: UpdateRolesBulkDto): Promise<Role[]> {
    const permissionTransformer = new PermissionTransformer()
    const roles: UpdateRoleTransformedType[] = dto.roles.map(role => ({
      uuid: role.uuid,
      permissions: permissionTransformer.transformObjectToPermissions(role.permissions)
    }))

    await this.roleRepository.upsert(roles, { conflictPaths: { uuid: true } })

    await this.cache.clearRolesPermissions(dto.roles.map(role => role.uuid))

    await this.typesenseCollectionService.importToTypesense(TypesenseCollectionName.USER)

    return await this.roleRepository.findBy({
      uuid: In(dto.roles.map(role => role.uuid))
    })
  }

  async delete (uuid: string): Promise<void> {
    const role = await this.findOne(uuid)

    if (role.name === 'admin' || role.name === 'readonly') {
      throw new RoleNotEditableError()
    }

    const readOnlyRole = await this.roleRepository.findOneOrFail({
      where: { name: 'readonly' }
    })

    const users = await this.userRepository.find({
      where: { roleUuid: role.uuid }
    })

    await transaction(this.dataSource, async () => {
      await this.userRepository.update({
        roleUuid: uuid
      }, {
        roleUuid: readOnlyRole.uuid
      })

      users.forEach((user) => {
        user.roleUuid = readOnlyRole.uuid
      })

      await this.roleRepository.remove(role)
    })

    await this.cache.clearRolesPermissions([uuid])
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
