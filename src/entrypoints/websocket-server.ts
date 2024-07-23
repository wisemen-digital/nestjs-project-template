import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app.module.js'
import { WSModule } from '../modules/websocket/ws.module.js'
import { AuthenticatedWsAdapter } from '../modules/websocket/ws-adapter.js'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(AppModule.forRoot([
    WSModule.register()
  ]))

  app.useWebSocketAdapter(new AuthenticatedWsAdapter(app))

  app.enableShutdownHooks()

  await app.init()
}

await bootstrap()
