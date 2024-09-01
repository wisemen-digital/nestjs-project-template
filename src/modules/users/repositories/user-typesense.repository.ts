import { Injectable } from '@nestjs/common'
import type { SearchParams } from 'typesense/lib/Typesense/Documents.js'
import { TypesenseQueryService } from '../../typesense/services/typesense-query.service.js'
import { TypesenseSearchParamsBuilder } from '../../typesense/builder/search-params.builder.js'
import { UserSearchSchema, UserTypesenseCollection } from '../../typesense/collections/user.collections.js'
import { TypesenseCollectionName } from '../../typesense/enums/typesense-collection-index.enum.js'

import type { ViewUsersQuery } from '../use-cases/view-users/view-users.query.js'

@Injectable()
export class UserTypesenseRepository {
  constructor (
    private readonly typesenseService: TypesenseQueryService
  ) {}

  async findPaginated (
    query: ViewUsersQuery
  ): Promise<[items: UserSearchSchema[], count: number] > {
    const typesenseSearchParams = this.createTypesenseSearchParams(query)

    const typesenseSearchedValues = await this.typesenseService.search(
      TypesenseCollectionName.USER,
      typesenseSearchParams
    )

    const usersResponse = typesenseSearchedValues[TypesenseCollectionName.USER]

    return [
      usersResponse?.items ?? [],
      usersResponse?.meta.total ?? 0
    ]
  }

  private createTypesenseSearchParams (query: ViewUsersQuery): SearchParams {
    const searchParamBuilder
      = new TypesenseSearchParamsBuilder(new UserTypesenseCollection())
        .withQuery(query.search)
        .withOffset(query.pagination?.offset)
        .withLimit(query.pagination?.limit)
        .addSearchOn(['firstName', 'lastName'])
        .addFilterOn('permissions', query.filter?.permissions)

    return searchParamBuilder.build()
  }
}
