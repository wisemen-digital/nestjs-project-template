import { ApiProperty } from '@nestjs/swagger'
import { ConflictApiError } from '../../../../utils/exceptions/api-errors/conflict.api-error.js'
import { ApiErrorCode } from '../../../../utils/exceptions/api-errors/api-error-code.decorator.js'
import { ApiErrorMeta } from '../../../../utils/exceptions/api-errors/api-error-meta.decorator.js'

class EmailAlreadyInUseErrorMeta {
  @ApiProperty({
    required: true,
    description: 'the email which is already in use',
    example: 'kobe.kwanten@wisemen.digital'
  })
  readonly email: string

  constructor (email: string) {
    this.email = email
  }
}

export class EmailAlreadyInUseError extends ConflictApiError {
  @ApiErrorCode('email_already_in_use')
  readonly code = 'email_already_in_use'

  @ApiErrorMeta()
  readonly meta: EmailAlreadyInUseErrorMeta

  constructor (email: string) {
    super(`Email ${email} is already in use by an existing user`)
    this.meta = new EmailAlreadyInUseErrorMeta(email)
  }
}
