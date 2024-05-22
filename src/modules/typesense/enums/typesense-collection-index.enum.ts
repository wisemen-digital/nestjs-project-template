import { type OffsetPaginatedResult } from '../../../utils/pagination/offset/paginated-result.interface.js'
import { type UserSearchSchema } from '../collections/user.collections.js'

export enum TypesenseCollection {
  USER = 'user'
}

export interface MultiSearchResult {
  [TypesenseCollection.USER]?: OffsetPaginatedResult<UserSearchSchema>
}
