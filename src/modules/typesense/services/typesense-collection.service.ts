import { Injectable } from '@nestjs/common'
import { type TypesenseAliasName } from '../enums/typesense-collection.index.enum.js'
import { TypesenseCollectorFactory } from './collectors/typesense-collector.factory.js'
import { TypesenseDocumentService } from './typesense-document.service.js'

@Injectable()
export class TypesenseCollectionService {
  constructor (
    private readonly typesenseDocumentService: TypesenseDocumentService,
    private readonly collectorFactory: TypesenseCollectorFactory
  ) {}

  async importManuallyToTypesense<T> (
    collection: TypesenseAliasName,
    objects: T[]
  ): Promise<void> {
    const collector = this.collectorFactory.create(collection)

    await this.typesenseDocumentService.addDocuments(
      collection,
      collector.transform(objects)
    )
  }

  async importToTypesense (
    collection: TypesenseAliasName,
    uuids?: string[]
  ): Promise<void> {
    const collector = this.collectorFactory.create(collection)

    const entities = await collector.fetch(uuids)
    await this.typesenseDocumentService.addDocuments(
      collection,
      collector.transform(entities)
    )
  }

  async deleteFromTypesense (collection: TypesenseAliasName, uuid: string): Promise<void> {
    await this.typesenseDocumentService.deleteDocument(collection, uuid)
  }
}
