import { ApiProperty } from '@nestjs/swagger'
import { ApiErrorCode } from '../../exceptions/api-errors/api-error-code.decorator.js'
import { ApiErrorMeta } from '../../exceptions/api-errors/api-error-meta.decorator.js'
import { ConflictApiError } from '../../exceptions/api-errors/conflict.api-error.js'

class RoleNameAlreadyInUseErrorMeta {
  @ApiProperty({
    required: true,
    description: 'the role name which is already in use',
    example: 'admin'
  })
  readonly name: string

  constructor (name: string) {
    this.name = name
  }
}

export class RoleNameAlreadyInUseError extends ConflictApiError {
  @ApiErrorCode('role_name_already_in_use')
  readonly code = 'role_name_already_in_use'

  @ApiErrorMeta()
  readonly meta: RoleNameAlreadyInUseErrorMeta

  constructor (name: string) {
    super(`Role name ${name} is already in use by another role`)
    this.meta = new RoleNameAlreadyInUseErrorMeta(name)
  }
}
