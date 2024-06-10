import { Injectable, type OnModuleInit, type OnModuleDestroy } from '@nestjs/common'
import { createRedisClient, type TypedRedisClient } from '../../../modules/redis/redis-client.js'
import { EventsGateway } from './events.gateway.js'

@Injectable()
export class RedisSubscriber implements OnModuleInit, OnModuleDestroy {
  private client: TypedRedisClient

  constructor (
    private readonly eventsGateway: EventsGateway
  ) {}

  async onModuleInit (): Promise<void> {
    this.client = createRedisClient(process.env.REDIS_URL)
    await this.client.connect()

    await this.client.subscribe('example', (body) => {
      this.eventsGateway.sendExample(body)
    })
  }

  async onModuleDestroy (): Promise<void> {
    await this.client.disconnect()
  }
}
