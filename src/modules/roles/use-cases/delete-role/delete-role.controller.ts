import { Controller, Get } from '@nestjs/common'
import { ApiOAuth2, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Permissions } from '../../../permissions/permissions.decorator.js'
import { Permission } from '../../../permissions/permission.enum.js'
import { UuidParam } from '../../../../utils/nest/decorators/uuid-param.js'
import { DeleteRoleUseCase } from './delete-role.user-case.js'

@ApiTags('Roles')
@Controller('roles/:role')
@ApiOAuth2([])
export class DeleteRoleController {
  constructor (
    private readonly useCase: DeleteRoleUseCase
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully received.'
  })
  @Permissions(Permission.ROLE_READ)
  async getRole (
    @UuidParam('role') uuid: string
  ): Promise<void> {
    await this.useCase.deleteRole(uuid)
  }
}
