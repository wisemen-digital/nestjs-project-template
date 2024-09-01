import { Injectable } from '@nestjs/common'
import { HealthCheckError, HealthIndicator, type HealthIndicatorResult } from '@nestjs/terminus'
import { RedisClient } from '../../redis/redis.client.js'

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor (private readonly redisClient: RedisClient) {
    super()
  }

  async isReady (key: string): Promise<HealthIndicatorResult> {
    try {
      await this.redisClient.ping()

      return this.getStatus(key, true)
    } catch {
      const result = this.getStatus(key, false, {
        message: 'Redis is not ready'
      })

      throw new HealthCheckError('RedisCheck failed', result)
    }
  }
}
