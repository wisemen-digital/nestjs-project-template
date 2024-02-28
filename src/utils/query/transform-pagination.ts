import { type PaginationQuery } from './pagination-query.dto.js'

export interface TypeORMPaginationType {
  page: number
  limit: number
}

export function transformPaginationForTypeORM (
  query?: PaginationQuery | null,
  maxLimit = 25
): TypeORMPaginationType {
  const limit = Math.min(query?.limit ?? maxLimit, maxLimit)
  const page = query?.page ?? 0

  return {
    page,
    limit
  }
}
