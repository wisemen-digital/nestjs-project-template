interface QueryFilter {
  [key: string]: QueryFilter | string
}

/**
 * Pagination with offset
 */

export interface PaginatedRequestQuery {
  pagination: {
    offset: number
    limit: number
  }
  filters?: QueryFilter
  sort?: Array<{
    field: string
    order: 'asc' | 'desc'
  }>
  search?: string
}

export interface PaginatedResponse <T> {
  data: T[]
  items: {
    offset: number
    limit: number
    total?: number
  }
}

/**
 * Pagination with key set
 */

export interface InfiniteScrollRequestQuery {
  pagination: {
    key?: string
    limit: number
  }
  filters?: QueryFilter
  sort?: Array<{
    field: string
    order: 'asc' | 'desc'
  }>
  search?: string
}

export interface InfiniteScrollResponse <T> {
  items: T[]
  meta: {
    next: string
  }
}
