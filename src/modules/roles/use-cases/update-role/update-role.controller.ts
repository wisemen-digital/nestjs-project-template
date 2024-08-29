import { Body, Controller, Post } from '@nestjs/common'
import { ApiOAuth2, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Permissions } from '../../../permissions/permissions.decorator.js'
import { Permission } from '../../../permissions/permission.enum.js'
import { CreateRoleDto } from '../../dtos/create-role.dto.js'
import { UuidParam } from '../../../../utils/nest/decorators/uuid-param.js'
import { RoleResponse, UpdateRoleResponse } from './update-role.response.js'
import { UpdateRoleUseCase } from './update-role.user-case.js'

@ApiTags('Roles')
@Controller('roles/:role')
@ApiOAuth2([])
export class UpdateRoleController {
  constructor (
    private readonly useCase: UpdateRoleUseCase
  ) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully updated.',
    type: RoleResponse
  })
  @Permissions(Permission.ROLE_UPDATE)
  async updateRole (
    @Body() updateRoleDto: CreateRoleDto,
    @UuidParam('role') uuid: string
  ): Promise<RoleResponse> {
    const role = await this.useCase.updateRole(uuid, updateRoleDto)

    return new UpdateRoleResponse().item(role)
  }
}
