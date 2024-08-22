import { Body, Controller, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { UserSelfOrAdminGuard } from '../../guards/user-update.guard.js'
import { Permissions } from '../../../permissions/permissions.decorator.js'
import { Permission } from '../../../permissions/permission.enum.js'
import { ChangePasswordUseCase } from './change-password.use-case.js'
import { ChangePasswordCommand } from './change-password.command.js'
import { PasswordChangedResponse } from './password-changed.response.js'

@ApiTags('User')
@Controller('users/:user/password')
export class ChangePasswordController {
  constructor (
    private readonly useCase: ChangePasswordUseCase
  ) {}

  @Post()
  @UseGuards(UserSelfOrAdminGuard)
  @Permissions(Permission.USER_UPDATE)
  @ApiOkResponse({
    description: 'The user\'s password has been successfully changed.',
    type: PasswordChangedResponse
  })
  async updateUserPassword (
    @Param('user', ParseUUIDPipe) userUuid: string,
    @Body() changePasswordCommand: ChangePasswordCommand
  ): Promise<PasswordChangedResponse> {
    const user = await this.useCase.changePassword(userUuid, changePasswordCommand)
    return new PasswordChangedResponse(user)
  }
}
