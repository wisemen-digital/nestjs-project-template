import { Transformer } from '@appwise/transformer'
import { type InfiniteScrollResult } from './infinite-scroll-result.interface.js'

export abstract class InfiniteScrollTransformer<From, To> extends Transformer<From, To> {
  paginated (
    infiniteScrollItems: InfiniteScrollResult<From>,
    timestampKey: keyof From
  ): InfiniteScrollResult<To> {
    return {
      items: this.array(infiniteScrollItems.items),
      meta: {
        lastTimestamp: this.getLastTimestamp(infiniteScrollItems.items, timestampKey)?.toISOString()
      }
    }
  }

  private getLastTimestamp (items: From[], timestampKey: keyof From): Date | undefined {
    if (items.length === 0) return
    const timestamp = items[items.length - 1][timestampKey]

    if (!(timestamp instanceof Date)) {
      throw Error(`Key:"${timestampKey.toString()}" is not a date in infinite scroll items.`)
    }
    return timestamp as Date
  }
}
