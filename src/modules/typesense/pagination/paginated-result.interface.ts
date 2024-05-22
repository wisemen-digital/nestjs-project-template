export interface TypesensePaginatedResult {
  meta: {
    total: number
    offset: number
    limit: number
  }
  items: string[]
}

export const emptyTypesensePaginatedResult = (): TypesensePaginatedResult => {
  return {
    items: [],
    meta: {
      total: 0,
      offset: 0,
      limit: 0
    }
  }
}
