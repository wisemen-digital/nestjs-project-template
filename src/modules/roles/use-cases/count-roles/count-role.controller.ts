import { Controller, Get } from '@nestjs/common'
import { ApiOAuth2, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Permissions } from '../../../permissions/permissions.decorator.js'
import { Permission } from '../../../permissions/permission.enum.js'
import { UuidParam } from '../../../../utils/nest/decorators/uuid-param.js'
import { CountRoleUseCase } from './count-role.user-case.js'
import { CountRoleResponse } from './count-role.response.js'

@ApiTags('Roles')
@Controller('roles/:role/count')
@ApiOAuth2([])
export class CreateRoleController {
  constructor (
    private readonly useCase: CountRoleUseCase
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The role count has been successfully received.',
    type: CountRoleResponse
  })
  @Permissions(Permission.ROLE_READ)
  async getRoleCount (
    @UuidParam('role') uuid: string
  ): Promise<CountRoleResponse> {
    const count = await this.useCase.countRole(uuid)

    return { count }
  }
}
