import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiOAuth2, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Permission } from '../../../permissions/permission.enum.js'
import { Permissions } from '../../../permissions/permissions.decorator.js'
import { UserIsSelfOrAdminGuard } from '../../guards/user-is-self-or-admin.guard.js'
import { UuidParam } from '../../../../utils/nest/decorators/uuid-param.js'
import { ChangeUserNameCommand } from './change-user-name.command.js'
import { ChangeUserNameUseCase } from './change-user-name.use-case.js'
import { UserNameChangedResponse } from './user-name-changed.response.js'

@ApiTags('User')
@ApiOAuth2([])
@Controller('users/:user/name')
export class ChangeUserNameController {
  constructor (
    private readonly useCase: ChangeUserNameUseCase
  ) {}

  @Post()
  @UseGuards(UserIsSelfOrAdminGuard)
  @Permissions(Permission.USER_UPDATE)
  @ApiOkResponse({
    description: 'The user name has been successfully changed.',
    type: UserNameChangedResponse
  })
  async updateUser (
    @UuidParam('user') userUuid: string,
    @Body() dto: ChangeUserNameCommand
  ): Promise<UserNameChangedResponse> {
    const user = await this.useCase.changeName(userUuid, dto)

    return new UserNameChangedResponse(user)
  }
}
