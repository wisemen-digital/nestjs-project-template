export function toBoolean (value: unknown): boolean {
  if (typeof value === 'string') {
    if (value === 'true') return true
    if (value === 'false') return false
  }

  throw new Error('Invalid boolean string')
}
