import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator, type HealthCheckResult } from '@nestjs/terminus'
import { ApiStatusType } from '../types/api-status.type.js'
import { Public } from '../../permissions/permissions.decorator.js'
import { RedisHealthIndicator } from '../health/redis.health.js'
import { TypesenseHealthIndicator } from '../health/typesense.health.js'
import { AppStateService } from '../services/app-state.service.js'

@ApiTags('Probes')
@Public()
@Controller({
  version: ''
})
export class StatusController {
  constructor (
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly redisHealthIndicator: RedisHealthIndicator,
    private readonly typesenseHealthIndicator: TypesenseHealthIndicator,
    private readonly appStateService: AppStateService
  ) {}

  @Get()
  getApiStatus (): ApiStatusType {
    return {
      environment: process.env.NODE_ENV,
      commit: process.env.BUILD_COMMIT,
      version: process.env.BUILD_NUMBER,
      timestamp: process.env.BUILD_TIMESTAMP
    }
  }

  @Get('/health')
  @HealthCheck()
  async liveness (): Promise<HealthCheckResult> {
    return await this.health.check([
      async () => this.appStateService.isHealthy('api')
    ])
  }

  @Get('/ready')
  @HealthCheck()
  async readiness (): Promise<HealthCheckResult> {
    return await this.health.check([
      async () => await this.redisHealthIndicator.isReady('redis'),
      async () => await this.db.pingCheck('postgres'),
      async () => await this.typesenseHealthIndicator.isReady('typesense')
    ])
  }
}
