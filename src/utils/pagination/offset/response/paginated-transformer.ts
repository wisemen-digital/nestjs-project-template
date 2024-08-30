import type { PaginatedOffsetQuery } from '../query/paginated-offset.query.js'

export interface TypeORMPaginationType {
  offset: number
  limit: number
}

export function transformOffsetPaginationForTypeORM (
  query?: PaginatedOffsetQuery | null,
  maxLimit = 25
): TypeORMPaginationType {
  const limit = Math.min(query?.limit ?? maxLimit, maxLimit)
  const offset = query?.offset ?? 0

  return {
    offset,
    limit
  }
}
