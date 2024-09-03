import { ApiErrorCode } from '../../../modules/exceptions/api-errors/api-error-code.decorator.js'
import { NotFoundApiError } from '../../../modules/exceptions/api-errors/not-found.api-error.js'

export class NotFoundError extends NotFoundApiError {
  @ApiErrorCode('not_found')
  code: 'not_found'

  meta: never

  constructor (detail?: string) {
    super(detail ?? 'Not Found')
  }
}
