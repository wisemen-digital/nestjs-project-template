import { NestFactory } from '@nestjs/core'
import { VersioningType } from '@nestjs/common'
import { AppModule } from '../app.module.js'
import { initSentry } from '../utils/sentry/sentry.js'
import { addApiDocumentation, addWebSocketDocumentation } from '../utils/swagger/swagger.js'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(AppModule.forRoot())

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

  addApiDocumentation(app, 'api/docs')
  addWebSocketDocumentation(app, 'api/docs/websockets')

  initSentry()

  app.enableShutdownHooks()

  await app.listen(3000)
}

await bootstrap()
