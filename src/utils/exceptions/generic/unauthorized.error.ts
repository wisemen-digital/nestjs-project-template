import { HttpStatus } from '@nestjs/common'
import { ApiErrorCode } from '../api-errors/api-error-code.decorator.js'
import { ApiErrorStatus } from '../api-errors/api-error-status.decorator.js'
import { ApiError } from '../api-errors/api-error.js'

export class UnauthorizedError extends ApiError {
  @ApiErrorCode('unauthorized')
  code: 'unauthorized'

  meta: never

  @ApiErrorStatus(HttpStatus.UNAUTHORIZED)
  declare status: '401'

  constructor (detail?: string) {
    super(detail ?? 'Unauthorized')
    this.status = '401'
  }
}
