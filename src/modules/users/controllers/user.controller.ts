import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { RequirePermissions } from '../../permissions/permissions.decorator.js'
import { Permission } from '../../permissions/permission.enum.js'
import { UpdateUserDto } from '../dtos/update-user.dto.js'
import { UserTransformerType, UserTransformer } from '../transformers/user.transformer.js'
import { AllowSelfAndAdminsGuard } from '../guards/user-update.guard.js'
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
  @RequirePermissions(Permission.USER_READ)
  async getUsers (
    @Query() query: UserQuery
  ): Promise<OffsetPaginatedResult<UserTransformerType>> {
    const [users, count] = await this.userFlowService.findPaginatedAndCount(query)

    return generatePaginatedResponse(new UserTransformer(), users, count, query.pagination)
  }

  @Post(':user')
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully updated.',
    type: UserTransformerType
  })
  @UseGuards(AllowSelfAndAdminsGuard)
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
  @UseGuards(AllowSelfAndAdminsGuard)
  async deleteUser (
    @Param('user', ParseUUIDPipe) userUuid: string
  ): Promise<void> {
    await this.userFlowService.delete(userUuid)
  }
}
