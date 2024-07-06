import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import { type NatsConnection, connect, credsAuthenticator, type Authenticator, type Payload, type Subscription, type SubscriptionOptions } from 'nats'
import { ConfigService } from '@nestjs/config'
import { isLocalEnv, isTestEnv } from '../../utils/envs/env-checks.js'

interface SubscribeOptions {
  loadBalance: boolean
}

@Injectable()
export class NatsClient implements OnModuleInit, OnModuleDestroy {
  public client: NatsConnection
  private readonly queueName: string

  constructor (
    private readonly configService: ConfigService
  ) {
    this.queueName = 'nest-template-' + this.configService.get('NODE_ENV')
  }

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
  }

  async onModuleDestroy (): Promise<void> {
    await this.client.close()
  }

  private getAuthenticator (): Authenticator | undefined {
    if (isTestEnv() || isLocalEnv()) {
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

  subscribe (subject: string, options?: SubscribeOptions): Subscription {
    const opts: SubscriptionOptions = {}
    if (options?.loadBalance != null) {
      opts.queue = this.queueName
    }

    return this.client.subscribe(subject, opts)
  }

  publish (subject: string, message: Payload | undefined): void {
    this.client.publish(subject, message)
  }
}
