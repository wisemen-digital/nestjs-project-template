import { applyDecorators, type Type } from '@nestjs/common'
import { ApiExtraModels, ApiOkResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { IsArray } from 'class-validator'

class InfiniteScrollEntityMeta {
  @ApiProperty()
  readonly lastTimestamp: number
}
class InfiniteScrollEntity<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly items: T[]

  @ApiProperty({ type: InfiniteScrollEntityMeta })
  readonly meta: InfiniteScrollEntityMeta
}

export const InfiniteScrollResponse = <T extends Type<unknown>>(entityType: T): MethodDecorator => {
  return applyDecorators(
    ApiExtraModels(InfiniteScrollEntity, entityType),
    ApiOkResponse({
      description: 'infinite scroll pagination response',
      schema: {
        allOf: [
          { $ref: getSchemaPath(InfiniteScrollEntity) },
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
