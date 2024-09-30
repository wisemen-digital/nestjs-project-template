import { NestFactory } from '@nestjs/core'
import { INestApplicationContext, VersioningType } from '@nestjs/common'
import { ExpressAdapter } from '@nestjs/platform-express'
import { ApiContainer } from '@wisemen/app-container'
import { AppModule } from '../app.module.js'
import { addApiDocumentation, addWebSocketDocumentation } from '../utils/swagger/swagger.js'

class Api extends ApiContainer {
  async bootstrap (adapter: ExpressAdapter): Promise<INestApplicationContext> {
    const app = await NestFactory.create(
      AppModule.forRoot(),
      adapter
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

    addApiDocumentation(app, 'api/docs')
    addWebSocketDocumentation(app, 'api/docs/websockets')

    return app
  }
}

const _api = new Api()
