import { HttpStatus } from '@nestjs/common'
import { ApiError } from './api-error.js'
import { ApiErrorStatus } from './api-error-status.decorator.js'

export abstract class NotFoundApiError extends ApiError {
  @ApiErrorStatus(HttpStatus.NOT_FOUND)
  declare status: '404'

  constructor (detail: string) {
    super(detail)
    this.status = '404'
  }
}
