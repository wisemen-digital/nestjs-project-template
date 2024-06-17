import bcrypt from 'bcryptjs'
import { KnownError } from '../exceptions/errors.js'

export async function createHash (value: string): Promise<string> {
  return await bcrypt.hash(value, 10)
}

export async function validatePassword (oldPassword: string, newPassword: string): Promise<void> {
  const match = await bcrypt.compare(oldPassword, newPassword)
  if (!match) {
    throw new KnownError('invalid_credentials')
  }
}
