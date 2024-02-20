import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Permission } from '../permission.enum.js'

@ApiTags('permissions')
@Controller('permissions')
export class PermissionController {
  @Get()
  async getPermissions (): Promise<Permission[]> {
    return Object.values(Permission)
  }
}
