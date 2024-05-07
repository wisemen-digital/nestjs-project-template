import { CreateRoleDto } from '../../../dtos/create-role.dto.js'

export class CreateRoleDtoBuilder {
  private readonly createRoleDto: CreateRoleDto = new CreateRoleDto()

  constructor () {
    this.createRoleDto.name = 'test-role'
  }

  withName (name: string): CreateRoleDtoBuilder {
    this.createRoleDto.name = name
    return this
  }

  build (): CreateRoleDto {
    return this.createRoleDto
  }
}
