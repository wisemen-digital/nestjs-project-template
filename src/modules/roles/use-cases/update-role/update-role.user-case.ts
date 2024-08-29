import { Injectable } from '@nestjs/common'
import { Role } from '../../entities/role.entity.js'
import { RoleRepository } from '../../repositories/role.repository.js'
import { CreateRoleDto } from '../../dtos/create-role.dto.js'
import { KnownError } from '../../../../utils/exceptions/errors.js'

@Injectable()
export class UpdateRoleUseCase {
  constructor (
    private readonly roleRepository: RoleRepository
  ) {}

  async updateRole (uuid: string, dto: CreateRoleDto): Promise<Role> {
    const exists = await this.findByName(dto.name)

    if (exists != null) throw new KnownError('already_exists').setDesc('Role already exists')

    await this.roleRepository.update(uuid, dto)

    const role = await this.roleRepository.findOneByOrFail({ uuid })

    return role
  }

  private async findByName (name: string): Promise<Role | null> {
    return await this.roleRepository.findOne({
      where: { name }
    })
  }
}
