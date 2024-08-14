import type { SearchParams } from 'typesense/lib/Typesense/Documents.js'
import { UserUuid } from '../../user-uuid.js'
import {
  TypesenseCollectionName
} from '../../../typesense/enums/typesense-collection-index.enum.js'
import { TypesenseSearchParamsBuilder } from '../../../typesense/builder/search-params.builder.js'
import { UserTypesenseCollection } from '../../../typesense/collections/user.collections.js'
import { type TypesenseQueryService } from '../../../typesense/services/typesense-query.service.js'

import type { ViewUsersQuery } from './view-users.query.js'

export class ViewUsersRepository {
  constructor (
    private readonly typesenseQueryService: TypesenseQueryService
  ) {}

  async find (
    query: ViewUsersQuery
  ): Promise<[items: UserUuid[], count: number] > {
    const typesenseSearchParams = this.createTypesenseSearchParams(query)

    const typesenseSearchedValues = await this.typesenseQueryService.search(
      TypesenseCollectionName.USER,
      typesenseSearchParams
    )
    const searchResult = typesenseSearchedValues[TypesenseCollectionName.USER]
    if (searchResult == null || searchResult.items.length === 0) {
      return [[], 0]
    }

    const uuids = searchResult.items.map(item => new UserUuid(item.uuid))
    const count = searchResult.meta.total ?? 0
    return [uuids, count]
  }

  private createTypesenseSearchParams (query: ViewUsersQuery | null): SearchParams {
    return new TypesenseSearchParamsBuilder(new UserTypesenseCollection())
      .withQuery(query?.search)
      .withOffset(query?.pagination?.offset)
      .withLimit(query?.pagination?.limit)
      .addSearchOn(['firstName', 'lastName'])
      .addFilterOn('permissions', query?.filter?.permissions)
      .build()
  }
}
