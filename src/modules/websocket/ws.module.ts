import { type DynamicModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import configuration from '../../config/env/configuration.js'
import { NatsClient } from '../nats/nats.client.js'
import { UserModule } from '../users/user.module.js'
import { RoleModule } from '../roles/role.module.js'
import { WSNatsGateway } from './ws-nats.gateway.js'
import { WsTopicValidator } from './ws-topic.validator.js'

@Module({})
export class WSModule {
  static register (): DynamicModule {
    return {
      module: WSModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath: process.env.ENV_FILE,
          load: [configuration]
        }),
        UserModule,
        RoleModule
      ],
      providers: [
        WSNatsGateway,
        NatsClient,
        WsTopicValidator
      ]
    }
  }
}
