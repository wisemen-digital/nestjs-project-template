import type { ValidationError } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { HttpStatus } from '@nestjs/common'
import { JsonApiErrorContent, JsonApiError } from '../exceptions/types/json-api-error.type.js'
import { camelToSnakeCase } from '../../utils/helpers/camel-to-snake-case.js'

function convertValidationError (errors: ValidationError[], path = '$'): JsonApiErrorContent[] {
  const convertedErrors: JsonApiErrorContent[] = []

  for (const error of errors) {
    const isArray = Array.isArray(error.target)

    const jsonpath = path + (isArray ? `[${error.property}]` : `.${error.property}`)

    if (error.children === undefined || error.children.length === 0) {
      if (error.constraints !== undefined) {
        const validationConstraintName = Object.keys(error.constraints)[0]

        convertedErrors.push({
          source: { pointer: jsonpath },
          code: 'validation_error.' + camelToSnakeCase(validationConstraintName),
          detail: error.constraints !== undefined ? Object.values(error.constraints)[0] : undefined
        })
      }
    } else {
      convertedErrors.push(...convertValidationError(error.children, jsonpath))
    }
  }

  return convertedErrors
}

export function convertValidationErrorToJsonApiError (errors: ValidationError[]): JsonApiError {
  const errorContents = convertValidationError(errors)

  return plainToInstance(JsonApiError, {
    status: HttpStatus.BAD_REQUEST,
    errors: errorContents
  })
}
