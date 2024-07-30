import { applyDecorators } from '@nestjs/common'
import { ApiBody, ApiExtraModels, getSchemaPath } from '@nestjs/swagger'

// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/ban-types
export function ApiOneOfBody (...models: Function[]) {
  return applyDecorators(
    ApiExtraModels(...models),
    ApiBody({
      schema: {
        oneOf: models.map(model => ({ $ref: getSchemaPath(model) }))
      }
    })
  )
}
