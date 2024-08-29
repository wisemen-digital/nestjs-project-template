import { Injectable } from '@nestjs/common'
import { Role } from '../../entities/role.entity.js'
import { RoleRepository } from '../../repositories/role.repository.js'

@Injectable()
export class GetRoleUseCase {
  constructor (
    private readonly roleRepository: RoleRepository
  ) {}

  async getRole (uuid: string): Promise<Role> {
    return await this.roleRepository.findOneOrFail({
      where: { uuid }
    })
  }
}
