import { ApiOAuth2, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { Permission } from '../../../permissions/permission.enum.js'
import { Permissions } from '../../../permissions/permissions.decorator.js'
import { UserIsSelfOrAdminGuard } from '../../guards/user-is-self-or-admin.guard.js'
import { UuidParam } from '../../../../utils/nest/decorators/uuid-param.js'
import { ViewUserUseCase } from './view-user.use-case.js'
import { ViewUserResponse } from './view-user.response.js'

@ApiTags('User')
@ApiOAuth2([])
@Controller('users/:user')
export class ViewUserController {
  constructor (
    private readonly useCase: ViewUserUseCase
  ) {}

  @Get()
  @UseGuards(UserIsSelfOrAdminGuard)
  @Permissions(Permission.USER_READ)
  @ApiOkResponse({
    description: 'User details retrieved',
    type: ViewUserResponse
  })
  async viewUser (
    @UuidParam('user') userUuid: string
  ): Promise<ViewUserResponse> {
    const user = await this.useCase.viewUser(userUuid)

    return new ViewUserResponse(user)
  }
}
