import { DocumentBuilder } from '@nestjs/swagger'
import { OpenApiDocument } from './open-api-document.js'

export function buildApiDocumentation (): OpenApiDocument {
  return new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API documentation description')
    .setVersion('1.0')
    .addServer('http://localhost:3000')
    .addServer('https://example.development.appwi.se')
    .addServer('https://example.staging.appwi.se')
    .addServer('https://example.test.appwi.se')
    .addServer('https://example.production.appwi.se')
    .addOAuth2({
      type: 'oauth2',
      flows: {
        password: {
          tokenUrl: 'http://localhost:3000/api/auth/token',
          refreshUrl: 'http://localhost:3000/api/auth/token',
          scopes: {
            read: 'Read access',
            write: 'Write access'
          }
        }
      }
    })
    .build()
}
