import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { AppModule } from '../app.module.js'
import { initSentry } from '../utils/sentry/sentry.js'
import { HttpExceptionFilter } from '../utils/exceptions/http-exception.filter.js'
import { addApiDocs, addWebSocketDocs } from '../modules/swagger/swagger.js'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(AppModule.forRoot())

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )
  app.setGlobalPrefix('api', {
    exclude: []
  })
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  })
  app.enableCors({
    exposedHeaders: ['Content-Disposition']
  })

  addApiDocs(app, 'api/docs')
  addWebSocketDocs(app, 'api/docs/websockets')

  const httpAdapterHost = app.get(HttpAdapterHost)

  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost))

  initSentry()

  app.enableShutdownHooks()

  await app.listen(3000)
}

await bootstrap()
