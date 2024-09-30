import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiOAuth2, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Permissions } from '../../../permissions/permissions.decorator.js'
import { Permission } from '../../../permissions/permission.enum.js'
import { UserIsSelfOrAdminGuard } from '../../guards/user-is-self-or-admin.guard.js'
import { UuidParam } from '../../../../utils/nest/decorators/uuid-param.js'

import {
  ApiBadRequestErrorResponse
} from '../../../exceptions/api-errors/api-error-response.decorator.js'
import { ChangePasswordUseCase } from './change-password.use-case.js'
import { ChangePasswordCommand } from './change-password.command.js'
import { PasswordChangedResponse } from './password-changed.response.js'
import { InvalidOldPasswordError } from './invalid-old-password.error.js'

@ApiTags('User')
@ApiOAuth2([])
@Controller('users/:user/password')
export class ChangePasswordController {
  constructor (
    private readonly useCase: ChangePasswordUseCase
  ) {}

  @Post()
  @UseGuards(UserIsSelfOrAdminGuard)
  @Permissions(Permission.USER_UPDATE)
  @ApiOkResponse({
    description: 'The user\'s password has been successfully changed.',
    type: PasswordChangedResponse
  })
  @ApiBadRequestErrorResponse(InvalidOldPasswordError)
  async updateUserPassword (
    @UuidParam('user') userUuid: string,
    @Body() changePasswordCommand: ChangePasswordCommand
  ): Promise<PasswordChangedResponse> {
    const user = await this.useCase.changePassword(userUuid, changePasswordCommand)

    return new PasswordChangedResponse(user)
  }
}
