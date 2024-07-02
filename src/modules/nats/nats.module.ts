import { type DynamicModule, Module, type Provider } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import configuration from '../../config/env/configuration.js'
import { RoleRepository } from '../roles/repositories/role.repository.js'
import { UserRepository } from '../users/repositories/user.repository.js'
import { NatsClient } from './nats.client.js'
import { NatsCacheService } from './nats-cache.service.js'

@Module({})
export class NatsModule {
  static forFeature (providers: Provider[] = []): DynamicModule {
    return {
      module: NatsModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath: process.env.ENV_FILE,
          load: [configuration]
        })
      ],
      providers: [
        NatsCacheService,
        NatsClient,
        RoleRepository,
        UserRepository,
        ...providers
      ],
      exports: [
        NatsCacheService
      ]
    }
  }
}
