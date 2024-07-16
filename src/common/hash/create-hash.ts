import bcrypt from 'bcryptjs'

export async function createHash (value: string): Promise<string> {
  return await bcrypt.hash(value, 10)
}
