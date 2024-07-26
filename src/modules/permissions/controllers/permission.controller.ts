import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Permission } from '../enums/permission.enum.js'
import { GET_PERMISSIONS_RESPONSE } from '../docs/permission-response.docs.js'
import { Permissions } from '../decorators/permissions.decorator.js'

@ApiTags('Permissions')
@Controller('permissions')
@ApiBearerAuth()
export class PermissionController {
  @Get('/')
  @ApiResponse(GET_PERMISSIONS_RESPONSE)
  @Permissions(Permission.PERMISSION_READ)
  public getPermissions (): Permission[] {
    return Object.values(Permission)
  }
}
