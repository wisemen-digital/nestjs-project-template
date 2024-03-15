import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Permission } from '../permission.enum.js'

@ApiTags('permissions')
@Controller('permissions')
export class PermissionController {
  @Get()
  getPermissions (): Permission[] {
    return Object.values(Permission)
  }
}
