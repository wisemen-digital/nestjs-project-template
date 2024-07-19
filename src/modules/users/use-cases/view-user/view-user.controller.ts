import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { UuidParam } from '../../../../common/uuid/uuid-param.js'
import { UserUuid } from '../../user-uuid.js'
import { AllowSelfAndAdminsGuard } from '../../guards/user-update.guard.js'
import { RequirePermission } from '../../../permissions/permissions.decorator.js'
import { Permission } from '../../../permissions/permission.enum.js'
import { ViewUserUseCase } from './view-user.use-case.js'
import { ViewUserResponse } from './view-user.response.js'

@ApiTags('User')
@Controller('users')
export class ViewUserController {
  constructor (
    private readonly useCase: ViewUserUseCase
  ) {}

  @Get(':userUuid')
  @UseGuards(AllowSelfAndAdminsGuard)
  @RequirePermission(Permission.USER_READ)
  @ApiOkResponse({ description: 'User details retrieved' })
  async viewUser (
    @UuidParam('userUuid', UserUuid) userUuid: UserUuid
  ): Promise<ViewUserResponse> {
    const user = await this.useCase.viewUser(userUuid)
    return new ViewUserResponse(user)
  }
}
