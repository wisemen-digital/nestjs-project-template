import { Body, Controller, Post } from '@nestjs/common'
import { ApiOAuth2, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Permission } from '../../../permissions/permission.enum.js'
import { Permissions } from '../../../permissions/permissions.decorator.js'
import { UuidParam } from '../../../../utils/nest/decorators/uuid-param.js'
import { ChangeUserRoleUseCase } from './change-user-role.use-case.js'
import { ChangeUserRoleCommand } from './change-user-role.command.js'

@ApiTags('User')
@ApiOAuth2([])
@Controller('users/:user/role')
export class ChangeUserRoleController {
  constructor (
    private readonly useCase: ChangeUserRoleUseCase
  ) {}

  @Post()
  @Permissions(Permission.ADMIN)
  @ApiOkResponse({ description: 'The user\'s role has been successfully changed.' })
  async updateUser (
    @UuidParam('user') userUuid: string,
    @Body() dto: ChangeUserRoleCommand
  ): Promise<void> {
    await this.useCase.changeRole(userUuid, dto)
  }
}
