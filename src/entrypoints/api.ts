import fs from 'node:fs'
import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { AppModule } from '../app.module.js'
import { initSentry } from '../helpers/sentry.js'
import { HttpExceptionFilter } from '../utils/exceptions/http-exception.filter.js'
import { WSModule } from '../modules/websocket/ws.module.js'
import { buildDocumentationConfig } from '../helpers/documentation.js'

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

  const config = buildDocumentationConfig()
  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api/docs', app, document)

  const configWs = new DocumentBuilder()
    .setTitle('WS Documentation')
    .setDescription(fs.readFileSync('./dist/src/modules/websocket/documentation.md').toString())
    .setVersion('1.0')
    .build()
  const wsDocument = SwaggerModule.createDocument(app, configWs, {
    include: [
      WSModule
    ]
  })

  SwaggerModule.setup('api/docs/websockets', app, wsDocument)

  const httpAdapterHost = app.get(HttpAdapterHost)

  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost))

  initSentry()

  app.enableShutdownHooks()

  app.enableCors({
    exposedHeaders: ['Content-Disposition']
  })

  await app.listen(3000)
}

await bootstrap()
