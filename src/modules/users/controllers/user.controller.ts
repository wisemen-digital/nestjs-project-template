import { Body, Controller, Delete, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common'
import { ApiOAuth2, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Permissions } from '../../permissions/permissions.decorator.js'
import { Permission } from '../../permissions/permission.enum.js'
import { UpdateUserGuard } from '../guards/user-update.guard.js'
import { UserFlowService } from '../services/user-flow.service.js'
import { UpdateUserRoleDto } from '../dtos/update-user-role.dto.js'

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor (
    private readonly userFlowService: UserFlowService
  ) {}

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

  @Post(':user/roles')
  @ApiResponse({
    status: 200,
    description: 'The users role has been successfully updated.'
  })
  @Permissions(Permission.ADMIN)
  async updateUserRole (
    @Param('user', ParseUUIDPipe) userUuid: string,
    @Body() dto: UpdateUserRoleDto
  ): Promise<void> {
    await this.userFlowService.updateRole(userUuid, dto.roleUuid)
  }
}
