import { ApiErrorCode } from '../../exceptions/api-errors/api-error-code.decorator.js'
import { BadRequestApiError } from '../../exceptions/api-errors/bad-request.api-error.js'

export class RoleNotEditableError extends BadRequestApiError {
  @ApiErrorCode('role_not_editable')
  readonly code = 'role_not_editable'

  readonly meta: never

  constructor () {
    super(`This role is not editable`)
  }
}
