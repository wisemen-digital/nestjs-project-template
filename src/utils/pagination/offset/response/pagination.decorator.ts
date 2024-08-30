import { applyDecorators, type Type } from '@nestjs/common'
import { ApiExtraModels, ApiOkResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { IsArray } from 'class-validator'

class OffsetPaginatedEntityMeta {
  @ApiProperty()
  readonly total: number

  @ApiProperty()
  readonly offset: number

  @ApiProperty()
  readonly limit: number
}

class OffsetPaginatedEntity<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly items: T[]

  @ApiProperty({ type: OffsetPaginatedEntityMeta })
  readonly meta: OffsetPaginatedEntityMeta
}

export const ApiOffsetPaginatedResponse = <T extends Type<unknown>>(
  entityType: T
): MethodDecorator => {
  return applyDecorators(
    ApiExtraModels(OffsetPaginatedEntity, entityType),
    ApiOkResponse({
      description: 'pagination response',
      schema: {
        allOf: [
          { $ref: getSchemaPath(OffsetPaginatedEntity) },
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
