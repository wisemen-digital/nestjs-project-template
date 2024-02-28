import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ParseQueryPipe } from '../../../utils/query/validators/query.validator.js'
import { PaginationResponse } from '../../../utils/pagination/pagination.decorator.js'
import { type PaginatedResult } from '../../../utils/pagination/paginated-result.interface.js'
import { Permissions, Public } from '../../permissions/permissions.decorator.js'
import { Permission } from '../../permissions/permission.enum.js'
import { CreateUserDto } from '../dtos/create-user.dto.js'
import { UpdatePasswordDto } from '../dtos/update-password.dto.js'
import { UpdateUserDto } from '../dtos/update-user.dto.js'
import { UserService } from '../services/user.service.js'
import { UserTransformerType, UserTransformer } from '../transformers/user.transformer.js'
import { UpdateUserGuard } from '../guards/user-update.guard.js'
import { UserPaginatedTransformer, UserPaginatedTransformerType } from '../transformers/user-paginated.transformer.js'
import { PaginationQuery } from '../../../utils/query/query.decorator.js'
import { UserQuery } from '../queries/user.query.js'

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor (private readonly userService: UserService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: UserTransformerType
  })
  @Public()
  async createUser (
    @Body() createUserDto: CreateUserDto
  ): Promise<UserTransformerType> {
    const user = await this.userService.create(createUserDto)

    return new UserTransformer().item(user)
  }

  @Get()
  @ApiOperation({
    summary: 'Get all the users. (Paginated data)'
  })
  @PaginationResponse(UserPaginatedTransformerType)
  @PaginationQuery(UserQuery)
  @Permissions(Permission.USER_READ)
  async getUsers (
    @Query('q', new ParseQueryPipe(UserQuery)) query
  ): Promise<PaginatedResult<UserPaginatedTransformerType>> {
    const users = await this.userService.findPaginated(query)

    return {
      items: new UserPaginatedTransformer().array(users.items),
      meta: users.meta
    }
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
    const user = await this.userService.findOne(userUuid)

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
    const user = await this.userService.findOne(userUuid)

    await this.userService.update(user, updateUserDto)

    return new UserTransformer().item(user)
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
    const user = await this.userService.findOne(userUuid)

    await this.userService.delete(user.uuid)
  }

  @Post(':user/password')
  @ApiResponse({
    status: 200,
    description: 'The users password has been successfully updated.'
  })
  @UseGuards(UpdateUserGuard)
  async updateUserPassword (
    @Param('user', ParseUUIDPipe) userUuid: string,
    @Body() updatePasswordDto: UpdatePasswordDto
  ): Promise<void> {
    const user = await this.userService.findOne(userUuid)

    await this.userService.updatePassword(user.uuid, updatePasswordDto)
  }
}
