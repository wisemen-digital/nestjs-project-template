export function snakeCase (str: string): string {
  return str.replace(/([A-Z])([A-Z])([a-z])/g, '$1_$2$3') // ABc -> a_bc
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2') // aC -> a_c
    .toLowerCase()
}
