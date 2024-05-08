import { CreateRoleDto } from '../../../dtos/create-role.dto.js'

export class CreateRoleDtoBuilder {
  private createRoleDto: CreateRoleDto

  constructor () {
    this.reset()
  }

  reset (): this {
    this.createRoleDto = new CreateRoleDto()

    this.createRoleDto.name = 'test-role'

    return this
  }

  withName (name: string): this {
    this.createRoleDto.name = name
    return this
  }

  build (): CreateRoleDto {
    const result = this.createRoleDto

    this.reset()

    return result
  }
}
