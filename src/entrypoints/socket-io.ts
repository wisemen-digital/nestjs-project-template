import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { mainDataSource } from '../config/sql/sources/main.js'
import { migrate } from '../config/sql/utils/typeorm.js'
import { SocketIOModule } from '../modules/socket-io/modules/socket-io.module.js'
import { HttpExceptionFilter } from '../utils/Exceptions/http-exception.filter.js'
import { AppModule } from '../app.module.js'

async function bootstrap (): Promise<void> {
  await mainDataSource.initialize().then(async () => { await migrate(mainDataSource) })
  const app = await NestFactory.create(AppModule.forRoot([
    SocketIOModule.register()
  ]))

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )
  app.enableCors()

  const httpAdapterHost = app.get(HttpAdapterHost)

  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost))

  await app.listen(9002)
}

await bootstrap()
