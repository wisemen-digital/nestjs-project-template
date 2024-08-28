export function toLowercase (value: unknown): unknown {
  return Array.isArray(value)
    ? value.map(v => toLowercase(v))
    : typeof value === 'string'
      ? value.toLowerCase()
      : value
}
