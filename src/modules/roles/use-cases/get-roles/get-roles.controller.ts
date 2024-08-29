import { Controller, Get } from '@nestjs/common'
import { ApiOAuth2, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Permissions } from '../../../permissions/permissions.decorator.js'
import { Permission } from '../../../permissions/permission.enum.js'
import { GetRolesUseCase } from './get-roles.user-case.js'
import { GetRolesResponse, RoleResponse } from './get-roles.response.js'

@ApiTags('Roles')
@Controller('roles')
@ApiOAuth2([])
export class GetRolesController {
  constructor (
    private readonly useCase: GetRolesUseCase
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The roles has been successfully received.',
    type: [RoleResponse]
  })
  @Permissions(Permission.ROLE_READ)
  async getRoles (): Promise<RoleResponse[]> {
    const roles = await this.useCase.getRoles()

    return new GetRolesResponse().array(roles)
  }
}
