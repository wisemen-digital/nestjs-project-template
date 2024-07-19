import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AllowSelfAndAdminsGuard } from '../../guards/user-update.guard.js'
import { UuidParam } from '../../../../common/uuid/uuid-param.js'
import { UserUuid } from '../../user-uuid.js'
import { Permission } from '../../../permissions/permission.enum.js'
import { RequirePermission } from '../../../permissions/permissions.decorator.js'
import { ChangePasswordUseCase } from './change-password.use-case.js'
import { ChangePasswordRequest } from './change-password.request.js'
import { PasswordChangedResponse } from './password-changed.response.js'
import { InvalidOldPasswordError } from './invalid-old-password.error.js'

@ApiTags('User')
@Controller('users')
export class ChangePasswordController {
  constructor (
    private readonly useCase: ChangePasswordUseCase
  ) {}

  @Post(':userUuid/password')
  @UseGuards(AllowSelfAndAdminsGuard)
  @RequirePermission(Permission.USER_UPDATE)
  @ApiOkResponse({ description: 'The user\'s password has been successfully changed.' })
  @ApiBadRequestResponse({ type: InvalidOldPasswordError })
  async updateUserPassword (
    @UuidParam('userUuid', UserUuid) userUuid: UserUuid,
    @Body() changePasswordRequest: ChangePasswordRequest
  ): Promise<PasswordChangedResponse> {
    const user = await this.useCase.changePassword(userUuid, changePasswordRequest)
    return new PasswordChangedResponse(user)
  }
}
