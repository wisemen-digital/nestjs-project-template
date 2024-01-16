import { SortDirection } from './sort-direction.enum.js'

export abstract class SortQuery {
  [key: string]: undefined | SortDirection
}

export abstract class LikeQuery {
  abstract key: unknown
  abstract value: unknown
}

export abstract class MatchQuery {
  [key: string]: unknown
}

export abstract class SearchQuery {
  abstract sort?: SortQuery
  abstract match?: MatchQuery
  abstract like?: LikeQuery
}
