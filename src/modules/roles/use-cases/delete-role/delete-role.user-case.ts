import { Injectable } from '@nestjs/common'
import { Role } from '../../entities/role.entity.js'
import { RoleRepository } from '../../repositories/role.repository.js'

@Injectable()
export class DeleteRoleUseCase {
  constructor (
    private readonly roleRepository: RoleRepository
  ) {}

  async deleteRole (uuid: string): Promise<Role> {
    return await this.roleRepository.findOneOrFail({
      where: { uuid }
    })
  }
}
