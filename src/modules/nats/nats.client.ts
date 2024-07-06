import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import { type NatsConnection, connect, type KV, credsAuthenticator, type Authenticator } from 'nats'
import { ConfigService } from '@nestjs/config'
import { isTestEnv } from '../../utils/envs/env-checks.js'

@Injectable()
export class NatsClient implements OnModuleInit, OnModuleDestroy {
  public client: NatsConnection
  public cache: KV

  constructor (
    private readonly configService: ConfigService
  ) {}

  async onModuleInit (): Promise<void> {
    const host = this.configService.get('NATS_HOST')
    const port = this.configService.get('NATS_PORT')

    if (host == null || port == null) {
      throw new Error('NATS config variables are not set')
    }

    this.client = await connect({
      servers: `nats://${host}:${port}`,
      authenticator: this.getAuthenticator(),
      timeout: 3000
    })

    this.cache = await this.client.jetstream().views.kv('cache')
  }

  async onModuleDestroy (): Promise<void> {
    await this.client.close()
  }

  private getAuthenticator (): Authenticator | undefined {
    if (isTestEnv()) {
      return undefined
    } else {
      const nkey = this.configService.get('NATS_NKEY')
      if (nkey == null) {
        throw new Error('NATS nkey is not set')
      }
      return credsAuthenticator(new TextEncoder().encode(
        Buffer.from(nkey, 'base64').toString()
      ))
    }
  }

  async getCachedValue (key: string): Promise<string | null> {
    const result = await this.cache.get(key)

    if (result != null && result.operation === 'PUT') {
      String(result.value)
    }

    return null
  }

  async putCachedValue (key: string, value: string): Promise<void> {
    await this.cache.put(key, value)
  }

  async deleteCachedValue (key: string): Promise<void> {
    await this.cache.delete(key)
  }
}
