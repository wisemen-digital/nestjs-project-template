import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { SocketIOModule } from '../modules/socket-io/modules/socket-io.module.js'
import { HttpExceptionFilter } from '../utils/Exceptions/http-exception.filter.js'
import { AppModule } from '../app.module.js'
import { initSentry } from '../helpers/sentry.js'

async function bootstrap (): Promise<void> {
  initSentry()

  const app = await NestFactory.create(AppModule.forRoot([
    SocketIOModule.register()
  ]))

  app.enableCors()

  const httpAdapterHost = app.get(HttpAdapterHost)

  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost))

  await app.listen(9002)
}

await bootstrap()
