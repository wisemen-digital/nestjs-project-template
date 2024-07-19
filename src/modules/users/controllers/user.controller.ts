import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ApiOffsetPaginatedResponse } from '../../../utils/pagination/offset/pagination.decorator.js'
import { Permissions } from '../../permissions/decorators/permissions.decorator.js'
import { Permission } from '../../permissions/enums/permission.enum.js'
import { CreateUserDto } from '../dtos/create-user.dto.js'
import { UpdatePasswordDto } from '../dtos/update-password.dto.js'
import { UpdateUserDto } from '../dtos/update-user.dto.js'
import { UserTransformerType, UserTransformer } from '../transformers/user.transformer.js'
import { DeleteUserGuard, UpdateUserGuard } from '../guards/user-update.guard.js'
import { UserQuery } from '../queries/user.query.js'
import { offsetPaginatedResponse, type OffsetPaginatedResult } from '../../../utils/pagination/offset/paginated-result.interface.js'
import { UserFlowService } from '../services/user-flow.service.js'
import { createUserResponse, deleteUserResponse, getUserResponse, updateUserPasswordResponse, updateUserResponse } from '../docs/user-response.docs.js'

@ApiTags('User')
@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor (
    private readonly userFlowService: UserFlowService
  ) {}

  @Post('/')
  @ApiResponse(createUserResponse)
  async createUser (
    @Body() createUserDto: CreateUserDto
  ): Promise<UserTransformerType> {
    const user = await this.userFlowService.create(createUserDto)
    return new UserTransformer().item(user)
  }

  @Get('/')
  @ApiOffsetPaginatedResponse(UserTransformerType)
  @Permissions(Permission.USER_READ)
  async getUsers (
    @Query() query: UserQuery
  ): Promise<OffsetPaginatedResult<UserTransformerType>> {
    const paginatedUsers = await this.userFlowService.findPaginatedAndCount(query)
    return offsetPaginatedResponse(new UserTransformer(), paginatedUsers, query)
  }

  @Get('/:userUuid')
  @ApiResponse(getUserResponse)
  @UseGuards(UpdateUserGuard)
  async getUser (
    @Param('userUuid', ParseUUIDPipe) userUuid: string
  ): Promise<UserTransformerType> {
    const user = await this.userFlowService.findOneOrFail(userUuid)
    return new UserTransformer().item(user)
  }

  @Post('/:userUuid')
  @ApiResponse(updateUserResponse)
  @UseGuards(UpdateUserGuard)
  async updateUser (
    @Param('userUuid', ParseUUIDPipe) userUuid: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserTransformerType> {
    const updatedUser = await this.userFlowService.update(userUuid, updateUserDto)
    return new UserTransformer().item(updatedUser)
  }

  @Delete('/:userUuid')
  @ApiResponse(deleteUserResponse)
  @UseGuards(DeleteUserGuard)
  async deleteUser (
    @Param('userUuid', ParseUUIDPipe) userUuid: string
  ): Promise<void> {
    await this.userFlowService.delete(userUuid)
  }

  @Post('/:userUuid/password')
  @ApiResponse(updateUserPasswordResponse)
  @UseGuards(UpdateUserGuard)
  async updateUserPassword (
    @Param('userUuid', ParseUUIDPipe) userUuid: string,
    @Body() updatePasswordDto: UpdatePasswordDto
  ): Promise<void> {
    await this.userFlowService.updatePassword(userUuid, updatePasswordDto)
  }
}
