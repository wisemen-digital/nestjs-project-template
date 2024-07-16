import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Permissions } from '../../permissions/permissions.decorator.js'
import { Permission } from '../../permissions/permission.enum.js'
import { UpdateUserDto } from '../dtos/update-user.dto.js'
import { UserTransformerType, UserTransformer } from '../transformers/user.transformer.js'
import { UpdateUserGuard } from '../guards/user-update.guard.js'
import { UserQuery } from '../queries/user.query.js'
import { generatePaginatedResponse, type OffsetPaginatedResult } from '../../../common/pagination/offset/paginated-result.interface.js'
import { UserFlowService } from '../services/user-flow.service.js'

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor (
    private readonly userFlowService: UserFlowService
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The users have been successfully received.',
    type: [UserTransformerType]
  })
  @Permissions(Permission.USER_READ)
  async getUsers (
    @Query() query: UserQuery
  ): Promise<OffsetPaginatedResult<UserTransformerType>> {
    const [users, count] = await this.userFlowService.findPaginatedAndCount(query)

    return generatePaginatedResponse(new UserTransformer(), users, count, query.pagination)
  }

  @Get(':user')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully received.',
    type: UserTransformerType
  })
  @UseGuards(UpdateUserGuard)
  async getUser (
    @Param('user', ParseUUIDPipe) userUuid: string
  ): Promise<UserTransformerType> {
    const user = await this.userFlowService.findOneOrFail(userUuid)

    return new UserTransformer().item(user)
  }

  @Post(':user')
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully updated.',
    type: UserTransformerType
  })
  @UseGuards(UpdateUserGuard)
  async updateUser (
    @Param('user', ParseUUIDPipe) userUuid: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserTransformerType> {
    const updatedUser = await this.userFlowService.update(userUuid, updateUserDto)
    return new UserTransformer().item(updatedUser)
  }

  @Delete(':user')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.'
  })
  @UseGuards(UpdateUserGuard)
  async deleteUser (
    @Param('user', ParseUUIDPipe) userUuid: string
  ): Promise<void> {
    await this.userFlowService.delete(userUuid)
  }
}
