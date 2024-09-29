import { type DynamicModule, Module, type Provider } from '@nestjs/common'
import { NatsClient } from './nats.client.js'
import { ExamplePublisher } from './publishers/example.publisher.js'

@Module({})
export class NatsModule {
  static forRoot (providers: Provider[] = []): DynamicModule {
    return {
      module: NatsModule,
      imports: [],
      providers: [
        NatsClient,
        ExamplePublisher,
        ...providers
      ],
      exports: [
        NatsClient
      ]
    }
  }
}
