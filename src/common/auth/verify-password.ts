import bcrypt from 'bcryptjs'
import { KnownError } from '../exceptions/errors.js'

export async function verifyPassword (oldPassword: string, newPassword: string): Promise<void> {
  const match = await bcrypt.compare(oldPassword, newPassword)
  if (!match) {
    throw new KnownError('invalid_credentials')
  }
}
