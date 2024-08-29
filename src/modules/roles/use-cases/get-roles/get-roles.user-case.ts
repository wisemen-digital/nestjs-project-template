import { Injectable } from '@nestjs/common'
import { Role } from '../../entities/role.entity.js'
import { RoleRepository } from '../../repositories/role.repository.js'

@Injectable()
export class GetRolesUseCase {
  constructor (
    private readonly roleRepository: RoleRepository
  ) {}

  async getRoles (): Promise<Role[]> {
    return await this.roleRepository.find()
  }
}
