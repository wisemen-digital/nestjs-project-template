import fs from 'node:fs'
import { DocumentBuilder } from '@nestjs/swagger'
import { OpenApiDocument } from './open-api-document.js'

export function buildWebSocketDocumentation (): OpenApiDocument {
  return new DocumentBuilder()
    .setTitle('WS Documentation')
    .setDescription(fs.readFileSync('./dist/src/modules/websocket/documentation.md').toString())
    .setVersion('1.0')
    .build()
}
