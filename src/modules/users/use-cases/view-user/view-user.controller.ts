import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common'
import { Permission } from '../../../permissions/permission.enum.js'
import { UpdateUserGuard } from '../../guards/user-update.guard.js'
import { Permissions } from '../../../permissions/permissions.decorator.js'
import { ViewUserUseCase } from './view-user.use-case.js'
import { ViewUserResponse } from './view-user.response.js'

@ApiTags('User')
@Controller('users/:user')
export class ViewUserController {
  constructor (
    private readonly useCase: ViewUserUseCase
  ) {}

  @Get()
  @UseGuards(UpdateUserGuard)
  @Permissions(Permission.USER_READ)
  @ApiOkResponse({ description: 'User details retrieved' })
  async viewUser (
    @Param('user', ParseUUIDPipe) userUuid: string
  ): Promise<ViewUserResponse> {
    const user = await this.useCase.viewUser(userUuid)
    return new ViewUserResponse(user)
  }
}
