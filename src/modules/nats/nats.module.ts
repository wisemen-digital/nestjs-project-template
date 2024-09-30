import { type DynamicModule, Module, type Provider } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NatsClient } from './nats.client.js'
import { NatsOutboxSubscriber } from './outbox/nats-outbox.subscriber.js'
import { ExamplePublisher } from './publishers/example.publisher.js'
import { NatsOutboxRepository } from './outbox/nats-outbox.repository.js'
import { NatsOutboxEvent } from './outbox/nats-outbox-event.js'
import { NatsOutboxEventSerializer } from './outbox/nats-outbox-event.serializer.js'

@Module({})
export class NatsModule {
  static forRoot (providers: Provider[] = []): DynamicModule {
    return {
      module: NatsModule,
      imports: [
        TypeOrmModule.forFeature([NatsOutboxEvent])
      ],
      providers: [
        NatsClient,
        ExamplePublisher,
        NatsOutboxSubscriber,
        NatsOutboxRepository,
        NatsOutboxEventSerializer,
        ...providers
      ],
      exports: [
        NatsClient
      ]
    }
  }
}
