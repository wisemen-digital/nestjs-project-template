import { Body, Controller, Post } from '@nestjs/common'
import { ApiOAuth2, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Permissions } from '../../../permissions/permissions.decorator.js'
import { Permission } from '../../../permissions/permission.enum.js'
import { UpdateRolesBulkDto } from '../../dtos/update-roles-bulk.dto.js'
import { UpdateRolesUseCase } from './update-roles.user-case.js'
import { RoleResponse, UpdateRolesResponse } from './update-roles.response.js'

@ApiTags('Roles')
@Controller('roles/bulk')
@ApiOAuth2([])
export class GetRolesController {
  constructor (
    private readonly useCase: UpdateRolesUseCase
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The roles has been successfully created.',
    type: [RoleResponse]
  })
  @Permissions(Permission.ROLE_UPDATE)
  async updateRolesBulk (
    @Body() updateRolesBulk: UpdateRolesBulkDto
  ): Promise<RoleResponse[]> {
    const roles = await this.useCase.updateRolesBulk(updateRolesBulk)

    return new UpdateRolesResponse().array(roles)
  }
}
