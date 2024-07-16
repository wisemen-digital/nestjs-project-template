import { type OffsetPaginationQuery } from '../../query/pagination/offset/pagination-query.dto.js'

export interface TypeORMPaginationType {
  offset: number
  limit: number
}

export function transformOffsetPaginationForTypeORM (
  query?: OffsetPaginationQuery | null,
  maxLimit = 25
): TypeORMPaginationType {
  const limit = Math.min(query?.limit ?? maxLimit, maxLimit)
  const offset = query?.offset ?? 0

  return {
    offset,
    limit
  }
}
