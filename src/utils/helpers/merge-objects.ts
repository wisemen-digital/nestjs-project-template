export function mergeObjects (...objects: object[]): object {
  return objects.reduce((acc, obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        acc[key] = mergeObjects(acc[key] ?? {}, obj[key])
      } else {
        acc[key] = obj[key]
      }
    }
    return acc
  }, {})
}
