import { Body, Controller, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { UpdateUserGuard } from '../../guards/user-update.guard.js'
import { ChangePasswordUseCase } from './change-password.use-case.js'
import { ChangePasswordRequest } from './change-password.request.js'

@ApiTags('User')
@Controller('users')
export class ChangePasswordController {
  constructor (
    private readonly useCase: ChangePasswordUseCase
  ) {}

  @Post(':user/password')
  @ApiResponse({
    status: 200,
    description: 'The user\'s password has been successfully changed.'
  })
  @UseGuards(UpdateUserGuard)
  async updateUserPassword (
    @Param('user', ParseUUIDPipe) userUuid: string,
    @Body() changePasswordRequest: ChangePasswordRequest
  ): Promise<void> {
    await this.useCase.changePassword(userUuid, changePasswordRequest)
  }
}
