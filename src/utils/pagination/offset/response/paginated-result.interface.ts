import type { Transformer } from '@appwise/transformer'
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '../../../../modules/typesense/builder/search-params.builder.js'
import type { PaginatedOffsetQuery } from '../query/paginated-offset.query.js'

/**
 * @deprecated User PaginatedOffsetResponse instead
 */
export interface OffsetPaginatedResult<T> {
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

export function generatePaginatedResponse<T, S> (
  transformer: Transformer<T, S>,
  items: T[],
  count: number,
  pagination: PaginatedOffsetQuery | undefined
): OffsetPaginatedResult<S> {
  return {
    items: transformer.array(items),
    meta: {
      total: count,
      offset: pagination?.offset ?? DEFAULT_OFFSET,
      limit: pagination?.limit ?? DEFAULT_LIMIT
    }
  }
}
