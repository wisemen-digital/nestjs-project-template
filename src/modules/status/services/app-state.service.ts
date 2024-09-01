import { Injectable, type OnModuleInit, type OnModuleDestroy, type OnApplicationBootstrap } from '@nestjs/common'
import { HealthCheckError, HealthIndicator, type HealthIndicatorResult } from '@nestjs/terminus'

export type ApplicationState = 'starting' | 'ready' | 'shutdown' | 'unknown'

@Injectable()
export class AppStateService extends HealthIndicator implements
OnModuleInit, OnModuleDestroy, OnApplicationBootstrap {
  private state: ApplicationState = 'unknown'

  onModuleInit (): void {
    this.state = 'starting'
  }

  onApplicationBootstrap (): void {
    this.state = 'ready'
  }

  onModuleDestroy (): void {
    this.state = 'shutdown'
  }

  isHealthy (key: string): HealthIndicatorResult {
    if (this.state === 'ready') {
      return this.getStatus(key, true)
    }

    const result: HealthIndicatorResult = this.getStatus('api', false, {
      message: 'Api is not ready'
    })

    throw new HealthCheckError('Api is not ready', result)
  }
}
