import { type DynamicModule, Module, type Provider } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import configuration from '../../config/env/configuration.js'
import { NatsClient } from './nats.client.js'

@Module({})
export class NatsModule {
  static forRoot (providers: Provider[] = []): DynamicModule {
    return {
      module: NatsModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath: process.env.ENV_FILE,
          load: [configuration]
        })
      ],
      providers: [
        NatsClient,
        ...providers
      ],
      exports: [
        NatsClient
      ]
    }
  }
}
