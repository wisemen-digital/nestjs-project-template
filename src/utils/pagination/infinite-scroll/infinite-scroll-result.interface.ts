export interface InfiniteScrollResult <T> {
  meta?: {
    lastTimestamp?: string
  }
  items: T[]
}

export const emptyInfiniteScrollResult = <T>(): InfiniteScrollResult<T> => {
  return {
    items: []
  }
}
