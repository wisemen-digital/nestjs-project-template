import { type DynamicModule, Module, type Provider } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import configuration from '../../config/env/configuration.js'
import { RedisClient } from './redis.client.js'

@Module({})
export class RedisModule {
  static forRoot (providers: Provider[] = []): DynamicModule {
    return {
      module: RedisModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath: process.env.ENV_FILE,
          load: [configuration]
        })
      ],
      providers: [
        RedisClient,
        ...providers
      ],
      exports: [
        RedisClient
      ]
    }
  }
}
