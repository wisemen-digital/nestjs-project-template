import { HttpStatusCode } from 'axios'
import { ApiError } from './api-error.js'
import { ApiErrorStatus } from './api-error-status.decorator.js'

export abstract class BadRequestApiError extends ApiError {
  @ApiErrorStatus(HttpStatusCode.BadRequest)
  status = '400'
}
