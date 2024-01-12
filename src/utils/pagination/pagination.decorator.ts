import { applyDecorators, type Type } from '@nestjs/common'
import { ApiExtraModels, ApiOkResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { IsArray } from 'class-validator'

class PaginatedEntityMeta {
  @ApiProperty()
  readonly count: number
}
class PaginatedEntity<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly items: T[]

  @ApiProperty({ type: PaginatedEntityMeta })
  readonly meta: PaginatedEntityMeta
}

export const ApiPaginatedResponse = <T extends Type<unknown>>(entityType: T): MethodDecorator => {
  return applyDecorators(
    ApiExtraModels(PaginatedEntity),
    ApiOkResponse({
      description: 'pagination response',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedEntity) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(entityType) }
              }
            }
          }
        ]
      }
    })
  )
}
