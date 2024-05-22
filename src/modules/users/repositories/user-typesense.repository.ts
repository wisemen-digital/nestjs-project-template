import { Injectable } from '@nestjs/common'
import { type SearchParams } from 'typesense/lib/Typesense/Documents.js'
import { TypesenseQueryService } from '../../typesense/services/typesense-query.service.js'
import { TypesenseSearchParamsBuilder } from '../../typesense/builder/search-params.builder.js'
import { UserTypesenseCollection } from '../../typesense/collections/user.collections.js'
import { TypesenseCollectionName } from '../../typesense/enums/typesense-collection-index.enum.js'
import { type UserQuery } from '../queries/user.query.js'
import { type TypesensePaginatedResult, emptyTypesensePaginatedResult } from '../../typesense/pagination/paginated-result.interface.js'

@Injectable()
export class UserTypesenseRepository {
  constructor (
    private readonly typesenseService: TypesenseQueryService
  ) {}

  async findPaginatedUuids (
    query: UserQuery
  ): Promise<TypesensePaginatedResult> {
    const typesenseSearchParams = this.createTypesenseSearchParams(query)

    const typesenseSearchedValues = await this.typesenseService.search(
      TypesenseCollectionName.USER,
      typesenseSearchParams
    )

    const userUuids = typesenseSearchedValues[TypesenseCollectionName.USER]?.items.map(
      item => item.uuid
    )

    if ((userUuids != null && userUuids.length === 0) || userUuids == null) {
      return emptyTypesensePaginatedResult()
    }

    return {
      items: userUuids,
      meta: {
        total: typesenseSearchedValues[TypesenseCollectionName.USER]?.meta.total ?? 0,
        offset: typesenseSearchedValues[TypesenseCollectionName.USER]?.meta.offset ?? 0,
        limit: typesenseSearchedValues[TypesenseCollectionName.USER]?.meta.limit ?? 0
      }
    }
  }

  createTypesenseSearchParams (query: UserQuery | null): SearchParams {
    const searchParamBuilder =
      new TypesenseSearchParamsBuilder(new UserTypesenseCollection())
        .withQuery(query?.search)
        .withOffset(query?.pagination?.offset)
        .withLimit(query?.pagination?.limit)
        .addSearchOn(['firstName', 'lastName'])
        .addFilterOn('permissions', query?.filter?.permissions)

    return searchParamBuilder.build()
  }
}
