import { OpenAPIObject } from '@nestjs/swagger'

export type OpenApiDocument = Omit<OpenAPIObject, 'paths'>
