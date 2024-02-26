import { captureException } from '@sentry/node'
import { Injectable } from '@nestjs/common'
import { type SearchParams } from 'typesense/lib/Typesense/Documents.js'
import { type PaginatedResult } from 'src/utils/pagination/paginated-result.interface.js'
import { TypesenseClient } from '../clients/typesense.client.js'
import { typesenseCollections, type TypesenseAliasName } from '../collections/typesense.collections.js'

@Injectable()
export class TypesenseService {
  constructor (
    private readonly typesenseClient: TypesenseClient
  ) {}

  public async searchAll (query: string): Promise<unknown> {
    const results = await Promise.all(
      typesenseCollections.map(async collection => {
        return await this.search(collection.name, {
          q: query,
          query_by: collection.createSchema.fields?.map(f => f.name).join(',') ?? ''
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
  ): Promise<Record<string, PaginatedResult<unknown>>> {
    try {
      const collectionName = (await this.typesenseClient.client.aliases(aliasName).retrieve())
        .collection_name
      const result = await this.typesenseClient.client
        .collections(collectionName)
        .documents()
        .search(searchParams)

      return {
        [collectionName]: {
          items: result.hits?.map(hit => hit.document) ?? [],
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
