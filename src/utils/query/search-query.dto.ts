import { Dto } from '@appwise/express-dto-router'
import type { SortDirection } from './sort-direction.enum.js'

export abstract class Query extends Dto {}

export abstract class SortQuery {
  abstract key: unknown
  abstract order: SortDirection
}

export abstract class FilterQuery {
  [key: string]: FilterQuery | string | string[] | undefined
}

export abstract class SearchQuery {
  abstract sort?: SortQuery[]
  abstract filter?: FilterQuery
  abstract search?: string
}
