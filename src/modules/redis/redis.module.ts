import { type DynamicModule, Module, type Provider } from '@nestjs/common'
import { RedisClient } from './redis.client.js'

@Module({})
export class RedisModule {
  static forRoot (providers: Provider[] = []): DynamicModule {
    return {
      module: RedisModule,
      imports: [],
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
