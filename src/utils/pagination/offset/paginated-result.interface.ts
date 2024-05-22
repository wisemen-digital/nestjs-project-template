export interface OffsetPaginatedResult <T> {
  meta: {
    total: number
    offset: number
    limit: number
  }
  items: T[]
}

export const emptyOffsetPaginatedResult = <T>(): OffsetPaginatedResult<T> => {
  return {
    items: [],
    meta: {
      total: 0,
      offset: 0,
      limit: 0
    }
  }
}
