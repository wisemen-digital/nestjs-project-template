import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../repositories/user.repository.js'
import { TypesenseCollectionService } from '../../../typesense/services/typesense-collection.service.js'
import { RoleService } from '../../../roles/services/role.service.js'
import { TypesenseCollectionName } from '../../../typesense/enums/typesense-collection-index.enum.js'
import { type ChangeUserRoleCommand } from './change-user-role.command.js'

@Injectable()
export class ChangeUserRoleUseCase {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly roleService: RoleService,
    private readonly typesenseService: TypesenseCollectionService
  ) {}

  async changeRole (userUuid: string, dto: ChangeUserRoleCommand): Promise<void> {
    const user = await this.userRepository.findOneByOrFail({ uuid: userUuid })
    const role = await this.roleService.findOne(dto.roleUuid)
    await this.typesenseService.importManuallyToTypesense(TypesenseCollectionName.USER, [user])
    await this.userRepository.update(user.uuid, { roleUuid: role.uuid })
  }
}
