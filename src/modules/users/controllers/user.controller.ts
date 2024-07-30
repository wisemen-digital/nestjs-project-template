import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
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
import { NotificationTransformer, type NotificationTransformerType } from '../../notifications/transformers/notification.transformer.js'
import { UpdateNotificationDto } from '../../notifications/dtos/update-notification.dto.js'

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
  public async createUser (
    @Body() createUserDto: CreateUserDto
  ): Promise<UserTransformerType> {
    const user = await this.userFlowService.create(createUserDto)
    return new UserTransformer().item(user)
  }

  @Get()
  @ApiOffsetPaginatedResponse(UserTransformerType)
  @ApiBearerAuth()
  @Permissions(Permission.USER_READ)
  public async getUsers (
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
  @ApiBearerAuth()
  @UseGuards(UpdateUserGuard)
  public async getUser (
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
  @ApiBearerAuth()
  @UseGuards(UpdateUserGuard)
  public async updateUser (
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
  @ApiBearerAuth()
  @UseGuards(UpdateUserGuard)
  public async deleteUser (
    @Param('user', ParseUUIDPipe) userUuid: string
  ): Promise<void> {
    await this.userFlowService.delete(userUuid)
  }

  @Post(':user/password')
  @ApiResponse({
    status: 200,
    description: 'The users password has been successfully updated.'
  })
  @ApiBearerAuth()
  @UseGuards(UpdateUserGuard)
  public async updateUserPassword (
    @Param('user', ParseUUIDPipe) userUuid: string,
    @Body() updatePasswordDto: UpdatePasswordDto
  ): Promise<void> {
    await this.userFlowService.updatePassword(userUuid, updatePasswordDto)
  }

  @Get(':user/devices/:deviceUuid')
  @ApiResponse({
    status: 200,
    description: 'The user notification settings have been successfully received.'
  })
  @ApiBearerAuth()
  public async getOneNotification (
    @Param('user', ParseUUIDPipe) userUuid: string,
    @Param('deviceUuid', ParseUUIDPipe) deviceUuid: string
  ): Promise<NotificationTransformerType[]> {
    const notification = await this.userFlowService.findNotificationSettings(userUuid, deviceUuid)

    return new NotificationTransformer().item(notification)
  }

  @Post(':user/devices/:deviceUuid')
  @ApiResponse({
    status: 201,
    description: 'The user notification settings have been successfully updated.'
  })
  @ApiBearerAuth()
  public async createNotification (
    @Param('user', ParseUUIDPipe) userUuid: string,
    @Param('deviceUuid', ParseUUIDPipe) deviceUuid: string,
    @Body() updateNotificationDto: UpdateNotificationDto
  ): Promise<NotificationTransformerType[]> {
    const notification = await this.userFlowService
      .updateNotificationSettings(userUuid, deviceUuid, updateNotificationDto)

    return new NotificationTransformer().item(notification)
  }
}
