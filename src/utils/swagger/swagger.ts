import { SwaggerModule } from '@nestjs/swagger'
import { INestApplication } from '@nestjs/common'
import { WSModule } from '../../modules/websocket/ws.module.js'
import { buildApiDocumentation } from './build-api-documentation.js'
import { buildWebSocketDocumentation } from './build-web-socket-documentation.js'

export function addApiDocumentation (toApp: INestApplication<unknown>, onRoute: string): void {
  const documentation = buildApiDocumentation()
  const document = SwaggerModule.createDocument(toApp, documentation)

  SwaggerModule.setup(onRoute, toApp, document)
}

export function addWebSocketDocumentation (
  toApp: INestApplication<unknown>,
  onRoute: string
): void {
  const documentation = buildWebSocketDocumentation()
  const document = SwaggerModule.createDocument(toApp, documentation, { include: [WSModule] })

  SwaggerModule.setup(onRoute, toApp, document)
}
