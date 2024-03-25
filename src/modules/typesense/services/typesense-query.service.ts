import { captureException } from '@sentry/node'
import { Injectable } from '@nestjs/common'
import { type SearchParams } from 'typesense/lib/Typesense/Documents.js'
import { TypesenseClient } from '../clients/typesense.client.js'
import { type MultiSearchResult, type TypesenseAliasName } from '../enums/typesense-collection.index.enum.js'
import { userCollection, type UserSearchSchema } from '../collections/user.collection.js'

@Injectable()
export class TypesenseQueryService {
  constructor (
    private readonly typesenseClient: TypesenseClient
  ) {}

  static COLLECTIONS = [
    userCollection
  ]

  public async searchAll (query: string): Promise<MultiSearchResult> {
    const results = await Promise.all(
      TypesenseQueryService.COLLECTIONS.map(async collection => {
        return await this.search(collection.name as TypesenseAliasName, {
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
    aliasName: TypesenseAliasName,
    searchParams: SearchParams
  ): Promise<MultiSearchResult> {
    try {
      const collectionName = (await this.typesenseClient.client.aliases(aliasName).retrieve())
        .collection_name
      const result = await this.typesenseClient.client
        .collections(collectionName)
        .documents()
        .search(searchParams)

      return {
        [aliasName]: {
          items: result.hits?.map(hit => hit.document) as UserSearchSchema[] ?? [],
          meta: {
            total: result.found
          }
        }
      }
    } catch (e) {
      captureException(e)
      return {}
    }
  }
}
