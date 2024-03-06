export interface PaginatedResult <T> {
  meta: {
    total: number
    page: number
    limit: number
  }
  items: T[]
}

export const emptyPaginatedResult = <T>(): PaginatedResult<T> => {
  return {
    items: [],
    meta: {
      total: 0,
      page: 0,
      limit: 0
    }
  }
}
