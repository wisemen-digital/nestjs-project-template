import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger'
import { HttpStatus } from '@nestjs/common'
import { type ClassConstructor } from 'class-transformer'

import { type ApiError } from './api-error.js'
import { type ConflictApiError } from './conflict.api-error.js'
import { type BadRequestApiError } from './bad-request.api-error.js'

export function ApiBadRequestErrorResponse (
  ...errors: Array<ClassConstructor<BadRequestApiError>>
): MethodDecorator {
  return ApiErrorResponse(HttpStatus.BAD_REQUEST, errors)
}

export function ApiConflictErrorResponse (
  ...errors: Array<ClassConstructor<ConflictApiError>>
): MethodDecorator {
  return ApiErrorResponse(HttpStatus.CONFLICT, errors)
}

function ApiErrorResponse (
  status: HttpStatus,
  errors: Array<ClassConstructor<ApiError>>
): MethodDecorator {
  const extraModelFunction = ApiExtraModels(...errors)
  const fooFunction = createApiResponseDecorator(status, errors)
  return function (target: object, key: string, descriptor: TypedPropertyDescriptor<unknown>) {
    extraModelFunction(target, key, descriptor)
    fooFunction(target, key, descriptor)
  }
}

function createApiResponseDecorator (
  status: HttpStatus,
  errors: Array<ClassConstructor<ApiError>>
): MethodDecorator {
  const errorDocs = errors.map(error => { return { $ref: getSchemaPath(error) } })
  return ApiResponse({
    status,
    schema: {
      type: 'object',
      properties: {
        errors: {
          type: 'array',
          items: { anyOf: errorDocs }
        }
      }
    }
  })
}
