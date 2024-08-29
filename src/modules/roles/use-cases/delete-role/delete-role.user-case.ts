import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { RoleRepository } from '../../repositories/role.repository.js'
import { KnownError } from '../../../../utils/exceptions/errors.js'
import { UserRepository } from '../../../users/repositories/user.repository.js'
import { transaction } from '../../../typeorm/utils/transaction.js'
import { CacheService } from '../../../cache/cache.service.js'

@Injectable()
export class DeleteRoleUseCase {
  constructor (
    private readonly roleRepository: RoleRepository,
    private readonly userRepository: UserRepository,
    private readonly cache: CacheService,
    private readonly dataSource: DataSource
  ) {}

  async deleteRole (uuid: string): Promise<void> {
    const role = await this.roleRepository.findOneByOrFail({ uuid })

    if (role.name === 'admin' || role.name === 'readonly') {
      throw new KnownError('not_editable').setDesc('Cannot delete this role')
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
}
