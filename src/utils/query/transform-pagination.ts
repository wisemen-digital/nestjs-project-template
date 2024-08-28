import type { OffsetPaginationQuery } from './pagination/offset/pagination-query.dto.js'

export interface TypeORMPaginationType {
  skip: number
  take: number
}

export function transformPaginationForTypeORM (
  query?: OffsetPaginationQuery | null,
  maxLimit = 25
): TypeORMPaginationType {
  const limit = Math.min(query?.limit ?? maxLimit, maxLimit)
  const offset = query?.offset ?? 0

  return {
    skip: offset,
    take: limit
  }
}
