import { type PaginationQuery } from './pagination/pages/pagination-query.dto.js'

export interface TypeORMPaginationType {
  skip: number
  take: number
}

export function transformPaginationForTypeORM (
  query?: PaginationQuery | null,
  maxLimit = 25
): TypeORMPaginationType {
  const limit = Math.min(query?.limit ?? maxLimit, maxLimit)
  const page = query?.page ?? 0

  return {
    skip: page * limit,
    take: limit
  }
}
