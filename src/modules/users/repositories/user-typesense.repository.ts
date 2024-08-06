import { Injectable } from '@nestjs/common'
import { type SearchParams } from 'typesense/lib/Typesense/Documents.js'
import { TypesenseQueryService } from '../../typesense/services/typesense-query.service.js'
import { TypesenseSearchParamsBuilder } from '../../typesense/builder/search-params.builder.js'
import { UserTypesenseCollection } from '../../typesense/collections/user.collections.js'
import { TypesenseCollectionName } from '../../typesense/enums/typesense-collection-index.enum.js'
import { type UserQuery } from '../queries/user.query.js'
import { emptyFindUuidsResponse } from '../../typesense/types/empty-find-uuids.response.js'

@Injectable()
export class UserTypesenseRepository {
  constructor (
    private readonly typesenseService: TypesenseQueryService
  ) {}

  async findPaginatedUuids (
    query: UserQuery
  ): Promise<[items: string[], count: number] > {
    const typesenseSearchParams = this.createTypesenseSearchParams(query)

    const typesenseSearchedValues = await this.typesenseService.search(
      TypesenseCollectionName.USER,
      typesenseSearchParams
    )

    const uuids = typesenseSearchedValues[TypesenseCollectionName.USER]?.items.map(
      item => item.uuid
    )

    if (uuids == null || uuids.length === 0) {
      return emptyFindUuidsResponse
    }

    const count = typesenseSearchedValues[TypesenseCollectionName.USER]?.meta.total ?? 0

    return [uuids, count]
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
