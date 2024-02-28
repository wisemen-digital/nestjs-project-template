export function base64JSON (of: object): string {
  const stringifiedObject = JSON.stringify(of)
  return Buffer.from(stringifiedObject).toString('base64')
}
