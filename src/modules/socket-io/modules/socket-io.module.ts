import { type DynamicModule, Module } from '@nestjs/common'
import { EventsGateway } from '../services/events.gateway.js'
import { SocketAuthMiddleware } from '../middleware/ws.middleware.js'
import { WsAuthGuard } from '../guards/ws-auth.guard.js'
import { UserModule } from '../../users/modules/user.module.js'
import { AuthModule } from '../../auth/modules/auth.module.js'

@Module({})
export class SocketIOModule {
  static register (): DynamicModule {
    return {
      module: SocketIOModule,
      imports: [
        UserModule,
        AuthModule
      ],
      providers: [
        EventsGateway,
        SocketAuthMiddleware,
        WsAuthGuard
      ]
    }
  }
}
