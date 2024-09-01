import { Injectable } from '@nestjs/common'
import { captureException } from '@sentry/node'
import type { TypesenseCollectionName } from '../enums/typesense-collection-index.enum.js'
import { TypesenseClient } from '../clients/typesense.client.js'

@Injectable()
export class TypesenseDocumentService {
  constructor (
    private readonly typesenseClient: TypesenseClient
  ) {}

  async addDocuments <T extends object> (
    index: TypesenseCollectionName,
    documents: T[],
    collectionName?: string
  ): Promise<void> {
    for (let i = 0; i < documents.length; i += 100) {
      const documentsChunk = documents.slice(i, i + 100)

      try {
        if (collectionName == null) {
          collectionName = (await this.typesenseClient.client.aliases(index).retrieve())
            .collection_name
        }

        await this.typesenseClient.client.collections(collectionName).documents().import(documentsChunk, { action: 'upsert' })
      } catch (e) {
        captureException(e)
      }
    }
  }

  public async deleteDocument (index: TypesenseCollectionName, uuid: string): Promise<void> {
    try {
      await this.typesenseClient.client.collections(index).documents(uuid).delete()
    } catch {
      // Ignore
    }
  }
}
