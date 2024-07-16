import {
  BadRequestApiError
} from '../../../../common/exceptions/api-errors/bad-request-api-error.js'
import { ApiErrorCode } from '../../../../common/exceptions/api-errors/api-error-code.decorator.js'

export class InvalidOldPasswordError extends BadRequestApiError {
  @ApiErrorCode('invalid_old_password')
  code: 'invalid_old_password'

  meta: never

  constructor () {
    super('The provided old password does not match the password of the user')
  }
}
