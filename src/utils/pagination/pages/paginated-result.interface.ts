export interface PaginatedResult <T> {
  meta?: {
    total?: number
  }
  items: T[]
}

export const emptyPaginatedResult = <T>(): PaginatedResult<T> => {
  return {
    items: [],
    meta: {
      total: 0
    }
  }
}
