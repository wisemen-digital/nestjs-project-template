import { Body, Controller, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Permission } from '../../../permissions/permission.enum.js'
import { Permissions } from '../../../permissions/permissions.decorator.js'
import { UserSelfOrAdminGuard } from '../../guards/user-update.guard.js'
import { ChangeUserNameCommand } from './change-user-name.command.js'
import { ChangeUserNameUseCase } from './change-user-name.use-case.js'
import { UserNameChangedResponse } from './user-name-changed.response.js'

@ApiTags('User')
@Controller('users/:user/name')
export class ChangeUserNameController {
  constructor (
    private readonly useCase: ChangeUserNameUseCase
  ) {}

  @Post()
  @UseGuards(UserSelfOrAdminGuard)
  @Permissions(Permission.USER_UPDATE)
  @ApiOkResponse({
    description: 'The user name has been successfully changed.',
    type: UserNameChangedResponse
  })
  async updateUser (
    @Param('user', ParseUUIDPipe) userUuid: string,
    @Body() dto: ChangeUserNameCommand
  ): Promise<UserNameChangedResponse> {
    const user = await this.useCase.changeName(userUuid, dto)
    return new UserNameChangedResponse(user)
  }
}
