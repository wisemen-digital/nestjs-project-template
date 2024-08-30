import type { OffsetPaginatedResult } from '../../../utils/pagination/offset/response/paginated-result.interface.js'
import type { UserSearchSchema } from '../collections/user.collections.js'

export enum TypesenseCollectionName {
  USER = 'user'
}

export interface MultiSearchResult {
  [TypesenseCollectionName.USER]?: OffsetPaginatedResult<UserSearchSchema>
}
