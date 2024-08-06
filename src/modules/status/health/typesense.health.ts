import { Injectable } from '@nestjs/common'
import { HealthIndicator, type HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus'
import { TypesenseClient } from '../../typesense/clients/typesense.client.js'

@Injectable()
export class TypesenseHealthIndicator extends HealthIndicator {
  constructor (private readonly typesenseClient: TypesenseClient) {
    super()
  }

  async isReady (key: string): Promise<HealthIndicatorResult> {
    try {
      await this.typesenseClient.ping()

      return this.getStatus(key, true)
    } catch (error) {
      const result = this.getStatus(key, false, {
        message: 'Typesense is not ready'
      })
      throw new HealthCheckError('TypesenseCheck failed', result)
    }
  }
}
