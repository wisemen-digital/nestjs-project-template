import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiStatusType } from '../types/api-status.type.js'
import { Public } from '../../permissions/permissions.decorator.js'

@ApiTags('Default')
@Controller({
  version: ''
})
export class StatusController {
  @Get()
  @Public()
  getApiStatus (): ApiStatusType {
    return {
      environment: process.env.NODE_ENV,
      commit: process.env.BUILD_COMMIT,
      version: process.env.BUILD_NUMBER,
      timestamp: process.env.BUILD_TIMESTAMP
    }
  }

  @Get('/health')
  @Public()
  getHealthStatus (): { status: string } {
    return { status: 'OK' }
  }
}
