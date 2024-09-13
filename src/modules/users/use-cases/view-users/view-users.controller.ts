import { ApiOAuth2, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Get, Query } from '@nestjs/common'
import { Permission } from '../../../permissions/permission.enum.js'
import { Permissions } from '../../../permissions/permissions.decorator.js'
import { ViewUsersQuery } from './view-users.query.js'
import { ViewUsersUseCase } from './view-users.use-case.js'
import { ViewUsersResponse } from './view-users.response.js'

@ApiTags('User')
@ApiOAuth2([])
@Controller('users')
export class ViewUsersController {
  constructor (
    private readonly useCase: ViewUsersUseCase
  ) {}

  @Get()
  @Permissions(Permission.USER_READ)
  @ApiOkResponse({
    description: 'Users retrieved',
    type: ViewUsersResponse
  })
  async viewUser (
    @Query() query: ViewUsersQuery
  ): Promise<ViewUsersResponse> {
    return await this.useCase.viewUsers(query)
  }
}
