import { type Transformer } from '@appwise/transformer'
import { type OffsetPaginationQuery } from '../../query/pagination/offset/pagination-query.dto.js'
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '../../../modules/typesense/builder/search-params.builder.js'

export interface OffsetPaginatedResult <T> {
  meta: {
    total: number
    offset: number
    limit: number
  }
  items: T[]
}

export const emptyOffsetPaginatedResult = <T>(): OffsetPaginatedResult<T> => {
  return {
    items: [],
    meta: {
      total: 0,
      offset: 0,
      limit: 0
    }
  }
}

export function offsetPaginatedResponse <T, S, Q extends { pagination?: OffsetPaginationQuery }> (
  transformer: Transformer<T, S>,
  [items, count]: [items: T[], count: number],
  query: Q | undefined
): OffsetPaginatedResult<S> {
  return {
    items: transformer.array(items),
    meta: {
      total: count,
      offset: query?.pagination?.offset ?? DEFAULT_OFFSET,
      limit: query?.pagination?.limit ?? DEFAULT_LIMIT
    }
  }
}
