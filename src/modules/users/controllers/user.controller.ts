import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common'
import { ApiOAuth2, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ApiOffsetPaginatedResponse } from '../../../utils/pagination/offset/pagination.decorator.js'
import { Permissions, Public } from '../../permissions/permissions.decorator.js'
import { Permission } from '../../permissions/permission.enum.js'
import { CreateUserDto } from '../dtos/create-user.dto.js'
import { UpdatePasswordDto } from '../dtos/update-password.dto.js'
import { UpdateUserDto } from '../dtos/update-user.dto.js'
import { UserTransformerType, UserTransformer } from '../transformers/user.transformer.js'
import { UpdateUserGuard } from '../guards/user-update.guard.js'
import { UserQuery } from '../queries/user.query.js'
import { generatePaginatedResponse, type OffsetPaginatedResult } from '../../../utils/pagination/offset/paginated-result.interface.js'
import { UserFlowService } from '../services/user-flow.service.js'

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor (
    private readonly userFlowService: UserFlowService
  ) {}

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
    const user = await this.userFlowService.create(createUserDto)
    return new UserTransformer().item(user)
  }

  @Get()
  @ApiOffsetPaginatedResponse(UserTransformerType)
  @ApiOAuth2([])
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
  @ApiOAuth2([])
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
  @ApiOAuth2([])
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
  @ApiOAuth2([])
  @UseGuards(UpdateUserGuard)
  async deleteUser (
    @Param('user', ParseUUIDPipe) userUuid: string
  ): Promise<void> {
    await this.userFlowService.delete(userUuid)
  }

  @Post(':user/password')
  @ApiResponse({
    status: 200,
    description: 'The users password has been successfully updated.'
  })
  @ApiOAuth2([])
  @UseGuards(UpdateUserGuard)
  async updateUserPassword (
    @Param('user', ParseUUIDPipe) userUuid: string,
    @Body() updatePasswordDto: UpdatePasswordDto
  ): Promise<void> {
    await this.userFlowService.updatePassword(userUuid, updatePasswordDto)
  }
}
