import bcrypt from 'bcryptjs'
import { KnownError } from '../exceptions/errors.js'

export async function createHash (value: string): Promise<string> {
  return await bcrypt.hash(value, 10)
}

export async function verifyPassword (password: string, hashedPassword: string): Promise<void> {
  const match = await bcrypt.compare(password, hashedPassword)
  if (!match) {
    throw new KnownError('invalid_credentials')
  }
}
