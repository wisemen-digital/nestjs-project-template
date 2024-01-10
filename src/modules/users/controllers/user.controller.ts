import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Permissions, Public } from '../../permissions/permissions.decorator.js'
import { Permission } from '../../permissions/permission.enum.js'
import { CreateUserDto } from '../dtos/create-user.dto.js'
import { UpdatePasswordDto } from '../dtos/update-password.dto.js'
import { UpdateUserDto } from '../dtos/update-user.dto.js'
import { UserService } from '../services/user.service.js'
import { UserTransformerType, UserTransformer } from '../transformers/user.transformer.js'
import { UpdateUserGuard } from '../guards/user-update.guard.js'

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
  @ApiResponse({
    status: 200,
    description: 'The users has been successfully received.',
    type: [UserTransformerType]
  })
  @Permissions(Permission.USER_READ)
  async getUsers (): Promise<UserTransformerType[]> {
    const users = await this.userService.findAll()

    return new UserTransformer().array(users)
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
