export function camelToSnakeCase (word: string): string {
  return word.replace(/([A-Z])/g, letter => `_${letter.toLowerCase()}`)
}
