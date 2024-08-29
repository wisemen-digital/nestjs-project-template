import { Body, Controller, Post } from '@nestjs/common'
import { ApiOAuth2, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Permissions } from '../../../permissions/permissions.decorator.js'
import { Permission } from '../../../permissions/permission.enum.js'
import { CreateRoleUseCase } from './create-role.user-case.js'
import { CreateRoleResponse, RoleResponse } from './create-role.response.js'

@ApiTags('Roles')
@Controller('roles')
@ApiOAuth2([])
export class CreateRoleController {
  constructor (
    private readonly useCase: CreateRoleUseCase
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The role has been successfully created.',
    type: RoleResponse
  })
  @Permissions(Permission.ROLE_CREATE)
  async createRole (
    @Body() createRoleDto: RoleResponse
  ): Promise<RoleResponse> {
    const role = await this.useCase.createRole(createRoleDto)

    return new CreateRoleResponse().item(role)
  }
}
