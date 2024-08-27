import { HttpStatusCode } from 'axios'
import { ApiError } from './api-error.js'
import { ApiErrorStatus } from './api-error-status.decorator.js'

export abstract class ConflictApiError extends ApiError {
  @ApiErrorStatus(HttpStatusCode.Conflict)
  status = '409'
}
