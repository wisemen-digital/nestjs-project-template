import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Permission } from '../../../permissions/permission.enum.js'
import { Permissions } from '../../../permissions/permissions.decorator.js'
import { ChangeUserRoleUseCase } from './change-user-role.use-case.js'
import { ChangeUserRoleCommand } from './change-user-role.command.js'

@ApiTags('User')
@Controller('users/:user/role')
export class ChangeUserRoleController {
  constructor (
    private readonly useCase: ChangeUserRoleUseCase
  ) {}

  @Post()
  @Permissions(Permission.ADMIN)
  @ApiOkResponse({ description: 'The user\'s role has been successfully changed.' })
  async updateUser (
    @Param('user', ParseUUIDPipe) userUuid: string,
    @Body() dto: ChangeUserRoleCommand
  ): Promise<void> {
    await this.useCase.changeRole(userUuid, dto)
  }
}
