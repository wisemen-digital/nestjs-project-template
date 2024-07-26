import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { ApiOffsetPaginatedResponse } from '../../../utils/pagination/offset/pagination.decorator.js'
import { CreateUserDto } from '../dtos/create-user.dto.js'
import { UpdateUserDto } from '../dtos/update-user.dto.js'
import { UserTransformerType, UserTransformer } from '../transformers/user.transformer.js'
import { UserQuery } from '../queries/user.query.js'
import { UserFlowService } from '../services/user-flow.service.js'
import { offsetPaginatedResponse, type OffsetPaginatedResult } from '../../../utils/pagination/offset/paginated-result.interface.js'
import { Permissions, Public } from '../../permissions/decorators/permissions.decorator.js'
import { Permission } from '../../permissions/enums/permission.enum.js'
import { UserGuard } from '../guards/user.guard.js'
import { CREATE_USER_RESPONSE, DELETE_USER_RESPONSE, GET_USER_RESPONSE, UPDATE_USER_PASSWORD_RESPONSE, UPDATE_USER_RESPONSE } from '../docs/user-response.docs.js'
import { UuidParam } from '../../../utils/params/uuid-param.utiil.js'
import { UpdatePasswordDto } from '../dtos/update-password.dto.js'

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor (
    private readonly userFlowService: UserFlowService
  ) {}

  @Post('/')
  @ApiResponse(CREATE_USER_RESPONSE)
  @Public()
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
  @ApiResponse(GET_USER_RESPONSE)
  @UseGuards(UserGuard)
  @Permissions(Permission.USER_READ)
  async getUser (
    @UuidParam('userUuid') userUuid: string
  ): Promise<UserTransformerType> {
    const user = await this.userFlowService.findOneOrFail(userUuid)
    return new UserTransformer().item(user)
  }

  @Post('/:userUuid')
  @ApiResponse(UPDATE_USER_RESPONSE)
  @UseGuards(UserGuard)
  @Permissions(Permission.USER_UPDATE)
  async updateUser (
    @UuidParam('userUuid') userUuid: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserTransformerType> {
    const updatedUser = await this.userFlowService.update(userUuid, updateUserDto)
    return new UserTransformer().item(updatedUser)
  }

  @Delete('/:userUuid')
  @ApiResponse(DELETE_USER_RESPONSE)
  @UseGuards(UserGuard)
  @Permissions(Permission.USER_DELETE)
  async deleteUser (
    @UuidParam('userUuid') userUuid: string
  ): Promise<void> {
    await this.userFlowService.delete(userUuid)
  }

  @Post('/:userUuid/password')
  @ApiResponse(UPDATE_USER_PASSWORD_RESPONSE)
  @UseGuards(UserGuard)
  @Permissions(Permission.USER_UPDATE)
  async updateUserPassword (
    @UuidParam('userUuid') userUuid: string,
    @Body() updatePasswordDto: UpdatePasswordDto
  ): Promise<void> {
    await this.userFlowService.updatePassword(userUuid, updatePasswordDto)
  }
}
