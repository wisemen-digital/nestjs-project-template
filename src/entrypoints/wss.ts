import { NestFactory } from '@nestjs/core'
import { INestApplicationContext } from '@nestjs/common'
import { ExpressAdapter } from '@nestjs/platform-express'
import { ApiContainer } from '@wisemen/app-container'
import { AppModule } from '../app.module.js'
import { WSModule } from '../modules/websocket/ws.module.js'
import { AuthenticatedWsAdapter } from '../modules/websocket/ws-adapter.js'

class WebsocketServer extends ApiContainer {
  async bootstrap (adapter: ExpressAdapter): Promise<INestApplicationContext> {
    const app = await NestFactory.create(
      AppModule.forRoot([
        WSModule.register()
      ]),
      adapter
    )

    app.useWebSocketAdapter(new AuthenticatedWsAdapter(app))

    return app
  }
}

const _websocketServer = new WebsocketServer()
