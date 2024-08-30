import type { PaginatedOffsetResponse } from '../../../utils/pagination/offset/paginated-offset.response.js'
import type { UserSearchSchema } from '../collections/user.collections.js'

export enum TypesenseCollectionName {
  USER = 'user'
}

export interface MultiSearchResult {
  [TypesenseCollectionName.USER]?: PaginatedOffsetResponse<UserSearchSchema>
}
