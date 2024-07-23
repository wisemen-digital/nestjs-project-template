import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AllowSelfAndAdminsGuard } from '../../guards/user-update.guard.js'
import { RequirePermission } from '../../../permissions/permissions.decorator.js'
import { Permission } from '../../../permissions/permission.enum.js'
import { UuidParam } from '../../../../common/uuid/uuid-param.js'
import { UserUuid } from '../../user-uuid.js'
import { ChangeUserNameRequest } from './change-user-name.request.js'
import { ChangeUserNameUseCase } from './change-user-name.use-case.js'
import { UserNameChangedResponse } from './user-name-changed.response.js'

@ApiTags('User')
@Controller('users')
export class ChangeUserNameController {
  constructor (
    private readonly useCase: ChangeUserNameUseCase
  ) {}

  @Post(':userUuid/name')
  @UseGuards(AllowSelfAndAdminsGuard)
  @RequirePermission(Permission.USER_UPDATE)
  @ApiOkResponse({ description: 'The user name has been successfully changed.' })
  async updateUser (
    @UuidParam('userUuid', UserUuid) userUuid: UserUuid,
    @Body() dto: ChangeUserNameRequest
  ): Promise<UserNameChangedResponse> {
    const user = await this.useCase.changeName(userUuid, dto)
    return new UserNameChangedResponse(user)
  }
}
