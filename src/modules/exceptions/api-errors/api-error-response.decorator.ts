import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger'
import { applyDecorators, HttpStatus } from '@nestjs/common'
import type { ClassConstructor } from 'class-transformer'
import type { ApiError } from './api-error.js'
import type { ConflictApiError } from './conflict.api-error.js'
import type { BadRequestApiError } from './bad-request.api-error.js'

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

export function ApiErrorResponse (
  status: HttpStatus,
  errors: Array<ClassConstructor<ApiError>>
): MethodDecorator {
  return applyDecorators(
    ApiExtraModels(...errors),
    createApiResponseDecorator(status, errors)
  )
}

function createApiResponseDecorator (
  status: HttpStatus,
  errors: Array<ClassConstructor<ApiError>>
): MethodDecorator {
  const errorDocs = errors.map(error => ({ $ref: getSchemaPath(error) }))

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
