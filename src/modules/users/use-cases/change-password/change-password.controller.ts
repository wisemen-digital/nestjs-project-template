import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Permissions } from '../../../permissions/permissions.decorator.js'
import { Permission } from '../../../permissions/permission.enum.js'
import { UserIsSelfOrAdminGuard } from '../../guards/user-is-self-or-admin.guard.js'
import { UuidParam } from '../../../../utils/nest/decorators/uuid-param.js'

import {
  ApiCompositeErrorResponse
} from '../../../exceptions/api-errors/composite-api-error-response.decorator.js'
import {
  ExampleCompositeApiError
} from '../../../exceptions/api-errors/example-composite.api-error.js'
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
  @UseGuards(UserIsSelfOrAdminGuard)
  @Permissions(Permission.USER_UPDATE)
  @ApiOkResponse({
    description: 'The user\'s password has been successfully changed.',
    type: PasswordChangedResponse
  })
  // @ApiBadRequestErrorResponse(InvalidOldPasswordError, InvalidPasswordError)
  // @ApiBadRequestResponse({ type: ExampleCompositeApiError })
  @ApiCompositeErrorResponse(HttpStatus.BAD_REQUEST, ExampleCompositeApiError)
  async updateUserPassword (
    @UuidParam('user') userUuid: string,
    @Body() changePasswordCommand: ChangePasswordCommand
  ): Promise<PasswordChangedResponse> {
    const user = await this.useCase.changePassword(userUuid, changePasswordCommand)

    return new PasswordChangedResponse(user)
  }
}
