import { type DynamicModule, Module, type Provider } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import configuration from '../../config/env/configuration.js'
import { NatsClient } from './nats.client.js'
import { EventFiredNatsEventListener } from './event-fired.nats.event-listener.js'
import { ExamplePublisher } from './publishers/example.publisher.js'
import { NatsOutboxRepository } from './nats-outbox.repository.js'
import { NatsEventOutbox } from './models/nats-event-outbox.js'

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
        TypeOrmModule.forFeature([NatsEventOutbox])
      ],
      providers: [
        NatsClient,
        ExamplePublisher,
        EventFiredNatsEventListener,
        NatsOutboxRepository,
        ...providers
      ],
      exports: [
        NatsClient
      ]
    }
  }
}
