import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Permission } from '../enums/permission.enum.js'
import { getPermissionsResponse } from '../docs/permission-response.docs.js'

@ApiTags('Permissions')
@Controller('permissions')
@ApiBearerAuth()
export class PermissionController {
  @Get('/')
  @ApiResponse(getPermissionsResponse)
  public getPermissions (): Permission[] {
    return Object.values(Permission)
  }
}
