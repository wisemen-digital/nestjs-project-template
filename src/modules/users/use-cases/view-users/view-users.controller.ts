import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Get, Query } from '@nestjs/common'
import { RequirePermission } from '../../../permissions/permissions.decorator.js'
import { Permission } from '../../../permissions/permission.enum.js'

import { ViewUsersQuery } from './view-users.query.js'
import { ViewUsersUseCase } from './view-users.use-case.js'
import { type ViewUsersResponse } from './view-users.response.js'

@ApiTags('User')
@Controller('users')
export class ViewUsersController {
  constructor (
    private readonly useCase: ViewUsersUseCase
  ) {}

  @Get()
  @RequirePermission(Permission.USER_READ)
  @ApiOkResponse({ description: 'Users retrieved' })
  async viewUser (
    @Query() query: ViewUsersQuery
  ): Promise<ViewUsersResponse> {
    return await this.useCase.viewUsers(query)
  }
}
