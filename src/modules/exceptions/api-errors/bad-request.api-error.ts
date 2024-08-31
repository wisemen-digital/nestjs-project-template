import { HttpStatus } from '@nestjs/common'
import { ApiError } from './api-error.js'
import { ApiErrorStatus } from './api-error-status.decorator.js'

export abstract class BadRequestApiError extends ApiError {
  @ApiErrorStatus(HttpStatus.BAD_REQUEST)
  declare status: '400'

  constructor (detail: string) {
    super(detail)
    this.status = '400'
  }
}
