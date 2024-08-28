export interface KeysetPaginatedResult<T> {
  meta?: {
    next?: string
  }
  items: T[]
}

export const emptyKeysetPaginatedResult = <T>(): KeysetPaginatedResult<T> => {
  return {
    items: []
  }
}
