import type { PaginatedOffsetQuery } from '../../pagination/offset/paginated-offset.query.js'

export interface TypeormPagination {
  skip: number
  take: number
}

export function typeormPagination (
  query?: PaginatedOffsetQuery | null,
  maxLimit = 25
): TypeormPagination {
  const limit = Math.min(query?.limit ?? maxLimit, maxLimit)
  const offset = query?.offset ?? 0

  return {
    skip: offset,
    take: limit
  }
}
