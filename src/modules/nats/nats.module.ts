import { type DynamicModule, Module, type Provider } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import configuration from '../../config/env/configuration.js'
import { NatsClient } from './nats.client.js'
import { NatsOutboxSubscriber } from './outbox/nats-outbox.subscriber.js'
import { ExamplePublisher } from './publishers/example.publisher.js'
import { NatsOutboxRepository } from './outbox/nats-outbox.repository.js'
import { NatsOutboxEvent } from './outbox/nats-outbox-event.js'

@Module({})
export class NatsModule {
  static forRoot (providers: Provider[] = []): DynamicModule {
    return {
      module: NatsModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath: process.env.ENV_FILE,
          load: [configuration]
        }),
        TypeOrmModule.forFeature([NatsOutboxEvent])
      ],
      providers: [
        NatsClient,
        ExamplePublisher,
        NatsOutboxSubscriber,
        NatsOutboxRepository,
        ...providers
      ],
      exports: [
        NatsClient
      ]
    }
  }
}
