import bcrypt from 'bcryptjs'
import { BadRequestApiError } from '../exceptions/api-errors/bad-request.api-error.js'
import { ApiErrorCode } from '../exceptions/api-errors/api-error-code.decorator.js'

export async function createHash (value: string): Promise<string> {
  return await bcrypt.hash(value, 10)
}

export async function verifyPassword (password: string, hashedPassword: string): Promise<void> {
  const match = await bcrypt.compare(password, hashedPassword)
  if (!match) {
    throw new InvalidPasswordError()
  }
}

export class InvalidPasswordError extends BadRequestApiError {
  @ApiErrorCode('invalid_password')
  code: 'invalid_password'

  meta: undefined
  constructor () {
    super('Password does not match the user\'s password')
  }
}
