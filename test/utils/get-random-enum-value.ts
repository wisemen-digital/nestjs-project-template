export function getRandomEnumValue<T extends object> (enumType: T): T[keyof T] {
  const enumValues = (Object.values(enumType) as unknown) as Array<T[keyof T]>
  const randomIndex = Math.floor(Math.random() * enumValues.length)

  return enumValues[randomIndex]
}
