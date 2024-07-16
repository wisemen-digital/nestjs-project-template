import { type OffsetPaginatedResult } from '../../../common/pagination/offset/paginated-result.interface.js'
import { type UserSearchSchema } from '../collections/user.collections.js'

export enum TypesenseCollectionName {
  USER = 'user'
}

export interface MultiSearchResult {
  [TypesenseCollectionName.USER]?: OffsetPaginatedResult<UserSearchSchema>
}
