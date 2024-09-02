import { ApiErrorCode } from '../api-errors/api-error-code.decorator.js'
import { NotFoundApiError } from '../api-errors/not-found.api-error.js'

export class NotFoundError extends NotFoundApiError {
  @ApiErrorCode('not_found')
  code: 'not_found'

  meta: never

  constructor (detail?: string) {
    super(detail ?? 'Not Found')
  }
}
