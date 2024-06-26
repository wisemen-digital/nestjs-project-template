import { Injectable, type OnModuleInit, type OnModuleDestroy } from '@nestjs/common'
import type { RedisClientType } from 'redis'
import { createRedisClient } from './redis-client.js'

@Injectable()
export class RedisClient implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType

  async onModuleInit (): Promise<void> {
    this.client = createRedisClient(process.env.REDIS_URL)
    await this.client.connect()
  }

  async onModuleDestroy (): Promise<void> {
    await this.client.disconnect()
  }

  async subscribe (topic: string): Promise<void> {
    await this.client.subscribe(topic)
  }

  async publish (topic: string, message: string): Promise<void> {
    await this.client.publish(topic, message)
  }
}
