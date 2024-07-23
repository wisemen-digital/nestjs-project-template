import { Controller, Get } from '@nestjs/common'
import { ApiOAuth2, ApiTags } from '@nestjs/swagger'
import { Permission } from '../permission.enum.js'

@ApiTags('Permissions')
@Controller('permissions')
@ApiOAuth2([])
export class PermissionController {
  @Get()
  getPermissions (): Permission[] {
    return Object.values(Permission)
  }
}
