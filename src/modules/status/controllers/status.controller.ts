import { Controller, Get } from '@nestjs/common'
import { ApiStatusType } from '../types/api-status.type.js'
import { Public } from '../../permissions/permissions.decorator.js'

@Controller({
  version: ''
})
export class StatusController {
  @Get()
  @Public()
  getApiStatus (): ApiStatusType {
    return {
      environment: process.env.NODE_ENV,
      commit: process.env.COMMIT,
      version: process.env.BUILD_NUMBER
    }
  }

  @Get('/health')
  @Public()
  getHealthStatus (): { status: string } {
    return { status: 'OK' }
  }
}
