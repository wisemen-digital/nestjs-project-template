import { Transformer } from '@appwise/transformer'
import type { PaginatedResult } from './paginated-result.interface.js'

export abstract class PaginatedTransformer<From, To> extends Transformer<From, To> {
  paginated (paginatedItems: PaginatedResult<From>): PaginatedResult<To> {
    return {
      items: this.array(paginatedItems.items),
      meta: paginatedItems.meta
    }
  }
}
