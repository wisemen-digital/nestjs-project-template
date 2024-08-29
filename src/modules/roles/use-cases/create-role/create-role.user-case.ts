import { Injectable } from '@nestjs/common'
import { Role } from '../../entities/role.entity.js'
import { RoleRepository } from '../../repositories/role.repository.js'
import { CreateRoleDto } from '../../dtos/create-role.dto.js'
import { KnownError } from '../../../../utils/exceptions/errors.js'

@Injectable()
export class CreateRoleUseCase {
  constructor (
    private readonly roleRepository: RoleRepository
  ) {}

  async createRole (dto: CreateRoleDto): Promise<Role> {
    let role = await this.findByName(dto.name)

    if (role != null) throw new KnownError('already_exists').setDesc('Role already exists')

    await this.roleRepository.insert(dto)

    role = await this.findByName(dto.name)

    if (role == null) throw new KnownError('not_found')

    return role
  }

  private async findByName (name: string): Promise<Role | null> {
    return await this.roleRepository.findOne({
      where: { name }
    })
  }
}
