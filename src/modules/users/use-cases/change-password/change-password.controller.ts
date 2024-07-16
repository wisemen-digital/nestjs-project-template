import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { UpdateUserGuard } from '../../guards/user-update.guard.js'
import { UuidParam } from '../../../../common/uuid/uuid-param.js'
import { UserUuid } from '../../user-uuid.js'
import { ChangePasswordUseCase } from './change-password.use-case.js'
import { ChangePasswordRequest } from './change-password.request.js'
import { ChangePasswordResponse } from './change-password.response.js'
import { InvalidOldPasswordError } from './invalid-old-password.error.js'

@ApiTags('User')
@Controller('users')
export class ChangePasswordController {
  constructor (
    private readonly useCase: ChangePasswordUseCase
  ) {}

  @Post(':user/password')
  @UseGuards(UpdateUserGuard)
  @ApiOkResponse({ description: 'The user\'s password has been successfully changed.' })
  @ApiBadRequestResponse({ type: InvalidOldPasswordError })
  async updateUserPassword (
    @UuidParam('user', UserUuid) userUuid: UserUuid,
    @Body() changePasswordRequest: ChangePasswordRequest
  ): Promise<ChangePasswordResponse> {
    const user = await this.useCase.changePassword(userUuid, changePasswordRequest)
    return new ChangePasswordResponse(user)
  }
}
