import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { AppModule } from '../app.module.js'
import { initSentry } from '../helpers/sentry.js'
import { HttpExceptionFilter } from '../utils/exceptions/http-exception.filter.js'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(
    AppModule.forRoot()
  )

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
  app.enableCors()

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API documentation description')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api/docs', app, document)

  const httpAdapterHost = app.get(HttpAdapterHost)

  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost))

  initSentry()

  app.enableShutdownHooks()

  await app.listen(3000)
}

await bootstrap()
