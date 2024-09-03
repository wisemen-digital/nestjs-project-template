import { ApiExtraModels, ApiResponse } from '@nestjs/swagger'
import { applyDecorators, HttpStatus } from '@nestjs/common'
import type { ClassConstructor } from 'class-transformer'
import { CompositeApiError } from './composite.api-error.js'

export function ApiCompositeErrorResponse (
  status: HttpStatus,
  error: ClassConstructor<CompositeApiError>
): MethodDecorator {
  return applyDecorators(
    ApiExtraModels(error),
    ApiResponse({ status, type: error })
  )
}
