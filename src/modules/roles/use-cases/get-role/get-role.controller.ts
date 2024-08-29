import { Controller, Get } from '@nestjs/common'
import { ApiOAuth2, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Permissions } from '../../../permissions/permissions.decorator.js'
import { Permission } from '../../../permissions/permission.enum.js'
import { UuidParam } from '../../../../utils/nest/decorators/uuid-param.js'
import { GetRoleUseCase } from './get-role.user-case.js'
import { GetRoleResponse, RoleResponse } from './get-role.response.js'

@ApiTags('Roles')
@Controller('roles/:role')
@ApiOAuth2([])
export class GetRoleController {
  constructor (
    private readonly useCase: GetRoleUseCase
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully received.',
    type: RoleResponse
  })
  @Permissions(Permission.ROLE_READ)
  async getRole (
    @UuidParam('role') uuid: string
  ): Promise<RoleResponse> {
    const role = await this.useCase.getRole(uuid)

    return new GetRoleResponse().item(role)
  }
}
