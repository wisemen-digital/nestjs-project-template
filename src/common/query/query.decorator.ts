import { applyDecorators, type Type } from '@nestjs/common'
import { ApiExtraModels, ApiQuery, getSchemaPath } from '@nestjs/swagger'

export function PaginationQuery (query: Type<unknown>): MethodDecorator {
  return applyDecorators(
    ApiExtraModels(query),
    ApiQuery({
      required: false,
      description: 'Pagination query, stringified object with optional pagination, sort, like and match',
      name: 'q',
      style: 'deepObject',
      explode: true,
      type: 'object',
      schema: {
        $ref: getSchemaPath(query)
      }
    })
  )
}
