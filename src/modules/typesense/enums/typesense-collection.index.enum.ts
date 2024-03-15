import { type PaginatedResult } from '../../../utils/pagination/paginated-result.interface.js'
import { type UserSearchSchema } from '../collections/user.collection.js'

export enum TypesenseAliasName {
  USER = 'user'
}

export interface MultiSearchResult {
  [TypesenseAliasName.USER]?: PaginatedResult<UserSearchSchema>
}
