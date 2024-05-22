import { captureException } from '@sentry/node'
import { Injectable } from '@nestjs/common'
import { type SearchParams } from 'typesense/lib/Typesense/Documents.js'
import { type MultiSearchResult, type TypesenseCollection } from '../enums/typesense-collection-index.enum.js'
import { TypesenseClient } from '../clients/typesense.client.js'
import { UserTypesenseCollection, type UserSearchSchema } from '../collections/user.collections.js'

@Injectable()
export class TypesenseQueryService {
  constructor (
    private readonly typesenseClient: TypesenseClient
  ) {}

  static COLLECTIONS = [
    new UserTypesenseCollection().getSchema()
  ]

  public async searchAll (query: string): Promise<MultiSearchResult> {
    const results = await Promise.all(
      TypesenseQueryService.COLLECTIONS.map(async collection => {
        return await this.search(collection.name as TypesenseCollection, {
          q: query,
          query_by: collection.fields?.map(f => f.name).join(',') ?? ''
        })
      })
    )

    return results.reduce((acc, curr) => {
      return Object.assign(acc, curr)
    }, {})
  }

  public async search (
    index: TypesenseCollection,
    searchParams: SearchParams
  ): Promise<MultiSearchResult> {
    try {
      const result = await this.typesenseClient.client
        .collections(index)
        .documents()
        .search(searchParams)

      return {
        [index]: {
          items: result.hits?.map(hit => hit.document) as UserSearchSchema[] ?? [],
          meta: {
            total: result.found,
            offset: 0,
            limit: 50
          }
        }
      }
    } catch (e) {
      captureException(e)
      return {}
    }
  }
}
