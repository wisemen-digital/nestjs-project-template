import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections.js'
import type { CollectionSchema } from 'typesense/lib/Typesense/Collection.js'
import type { CollectionAliasSchema } from 'typesense/lib/Typesense/Aliases.js'
import { TypesenseClient } from '../clients/typesense.client.js'
import { TypesenseCollectionName } from '../enums/typesense-collection-index.enum.js'
import { UserTypesenseCollection } from '../collections/user.collections.js'
import { TypesenseCollectionService } from './typesense-collection.service.js'

@Injectable()
export class TypesenseInitializationService {
  constructor (
    private readonly typesenseClient: TypesenseClient,
    private readonly typesenseCollectionService: TypesenseCollectionService
  ) {}

  public async retrieveCollections (): Promise<CollectionSchema[]> {
    return await this.typesenseClient.client.collections().retrieve()
  }

  public async createCollection (collection: CollectionCreateSchema): Promise<CollectionSchema> {
    collection.name = `${collection.name}_${dayjs().toISOString()}`

    return await this.typesenseClient.client.collections().create(collection)
  }

  public async deleteCollection (index: string): Promise<void> {
    await this.typesenseClient.client.collections(index).delete()
  }

  public async deleteUnusedCollections (): Promise<void> {
    const aliases = await this.retrieveAliases()
    const collections = await this.retrieveCollections()

    const inUseCollectionNames = aliases.map(alias => alias.collection_name)
    const existingCollectionNames = collections.map(collection => collection.name)

    for (const existingCollectionName of existingCollectionNames) {
      if (!inUseCollectionNames.includes(existingCollectionName)) {
        await this.deleteCollection(existingCollectionName)
      }
    }
  }

  public async aliasExists (index: string): Promise<boolean> {
    const aliases = await this.retrieveAliases()

    return aliases.some(alias => alias.name === index)
  }

  public async retrieveAliases (): Promise<CollectionAliasSchema[]> {
    return (await this.typesenseClient.client.aliases().retrieve()).aliases
  }

  public async linkAlias (aliasName: string, collectionName: string): Promise<void> {
    await this.typesenseClient.client.aliases().upsert(aliasName, {
      collection_name: collectionName
    })
  }

  public async migrate (fresh: boolean, indexes: TypesenseCollectionName[]): Promise<void> {
    if (indexes.includes(TypesenseCollectionName.USER)) {
      await this.migrateCollection(
        TypesenseCollectionName.USER,
        new UserTypesenseCollection().getSchema(),
        fresh
      )
    }
  }

  public async migrateCollection (
    aliasName: TypesenseCollectionName,
    createCollection: CollectionCreateSchema,
    fresh: boolean
  ): Promise<void> {
    const exists = await this.aliasExists(aliasName)

    if (fresh || !exists) {
      const collection = await this.createCollection(createCollection)

      await this.linkAlias(aliasName, collection.name)
      await this.typesenseCollectionService.importToTypesense(aliasName)
      await this.deleteUnusedCollections()
    }
  }

  public async import (indexes: TypesenseCollectionName[]): Promise<void> {
    if (indexes.includes(TypesenseCollectionName.USER)) {
      await this.typesenseCollectionService
        .importToTypesense(TypesenseCollectionName.USER)
    }
  }
}
