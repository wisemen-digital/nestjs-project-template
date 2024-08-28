import { HttpStatusCode } from 'axios'
import { ApiError } from './api-error.js'
import { ApiErrorStatus } from './api-error-status.decorator.js'

export abstract class ConflictApiError extends ApiError {
  @ApiErrorStatus(HttpStatusCode.Conflict)
  declare status: '409'

  constructor (detail: string) {
    super(detail)
    this.status = '409'
  }
}
