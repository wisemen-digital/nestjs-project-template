import { Injectable } from '@nestjs/common'
import { type SearchParams } from 'typesense/lib/Typesense/Documents.js'
import { type User } from '@sentry/types'
import { isArray } from 'class-validator'
import { TypesenseQueryService } from '../../typesense/services/typesense-query.service.js'
import { TypesenseSearchParamsBuilder } from '../../typesense/builder/search-params.builder.js'
import { UserTypesenseCollection } from '../../typesense/collections/user.collections.js'
import { TypesenseCollectionName } from '../../typesense/enums/typesense-collection-index.enum.js'
import { type UserQuery } from '../queries/user.query.js'
import { emptyFindUuidsResponse } from '../../typesense/types/empty-find-uuids.response.js'
import {
  TypesenseCollectionService
} from '../../typesense/services/typesense-collection.service.js'

@Injectable()
export class UserTypesenseRepository {
  constructor (
    private readonly typesenseQueryService: TypesenseQueryService,
    private readonly typesenseCollectionService: TypesenseCollectionService
  ) {}

  async findPaginatedUuids (
    query: UserQuery
  ): Promise<[items: string[], count: number] > {
    const typesenseSearchParams = this.createTypesenseSearchParams(query)

    const typesenseSearchedValues = await this.typesenseQueryService.search(
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

  private createTypesenseSearchParams (query: UserQuery | null): SearchParams {
    const searchParamBuilder =
      new TypesenseSearchParamsBuilder(new UserTypesenseCollection())
        .withQuery(query?.search)
        .withOffset(query?.pagination?.offset)
        .withLimit(query?.pagination?.limit)
        .addSearchOn(['firstName', 'lastName'])
        .addFilterOn('permissions', query?.filter?.permissions)

    return searchParamBuilder.build()
  }

  async insert (user: User): Promise<void>
  async insert (users: User[]): Promise<void>
  async insert (users: User | User[]): Promise<void> {
    if (!isArray(users)) {
      users = [users]
    }

    await this.typesenseCollectionService.importManually(
      TypesenseCollectionName.USER,
      users as User[]
    )
  }
}
