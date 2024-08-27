import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import type { RedisClientType } from 'redis'
import { createClient } from 'redis'

@Injectable()
export class RedisClient implements OnModuleInit, OnModuleDestroy {
  public client: RedisClientType

  async onModuleInit (): Promise<void> {
    const url = process.env.REDIS_URL

    if (url == null) {
      throw new Error('REDIS_URL is not set')
    }

    this.client = createClient({
      url,
      pingInterval: 10000
    })

    await this.client.connect()
  }

  async onModuleDestroy (): Promise<void> {
    if (this.client !== undefined) {
      await this.client.quit()
    }
  }

  async getCachedValue (key: string): Promise<string | null> {
    return await this.client.get(key)
  }

  async putCachedValue (key: string, value: string): Promise<void> {
    await this.client.set(key, value)
  }

  async deleteCachedValue (key: string): Promise<void> {
    await this.client.del(key)
  }
}
