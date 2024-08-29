import { Injectable } from '@nestjs/common'
import { In } from 'typeorm'
import { Role } from '../../entities/role.entity.js'
import { RoleRepository } from '../../repositories/role.repository.js'
import { PermissionTransformer } from '../../../permissions/transformers/permission.transformer.js'
import { UpdateRolesBulkDto } from '../../dtos/update-roles-bulk.dto.js'
import { TypesenseCollectionName } from '../../../typesense/enums/typesense-collection-index.enum.js'
import { UpdateRoleTransformedType } from '../../types/update-role-transformed.type.js'
import { TypesenseCollectionService } from '../../../typesense/services/typesense-collection.service.js'
import { CacheService } from '../../../cache/cache.service.js'

@Injectable()
export class UpdateRolesUseCase {
  constructor (
    private readonly roleRepository: RoleRepository,
    private readonly cache: CacheService,
    private readonly typesenseCollectionService: TypesenseCollectionService
  ) {}

  async updateRolesBulk (dto: UpdateRolesBulkDto): Promise<Role[]> {
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
}
