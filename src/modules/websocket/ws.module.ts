import { type DynamicModule, Module } from '@nestjs/common'
import { NatsClient } from '../nats/nats.client.js'
import { UserModule } from '../users/user.module.js'
import { RoleModule } from '../roles/role.module.js'
import { AuthMiddleware } from '../auth/middleware/auth.middleware.js'
import { WSNatsGateway } from './ws-nats.gateway.js'
import { WsTopicValidator } from './ws-topic.validator.js'

@Module({})
export class WSModule {
  static register (): DynamicModule {
    return {
      module: WSModule,
      imports: [
        UserModule,
        RoleModule
      ],
      providers: [
        WSNatsGateway,
        NatsClient,
        WsTopicValidator,
        AuthMiddleware
      ]
    }
  }
}
