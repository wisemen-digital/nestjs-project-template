import { Injectable } from '@nestjs/common'
import { type CollectionSchema } from 'typesense/lib/Typesense/Collection.js'
import { type CollectionCreateSchema } from 'typesense/lib/Typesense/Collections.js'
import { type CollectionAliasSchema } from 'typesense/lib/Typesense/Aliases.js'
import { captureException } from '@sentry/node'
import { type EntityManager } from 'typeorm'
import dayjs from 'dayjs'
import { TypesenseClient } from '../clients/typesense.client.js'
import { typesenseCollections, TypesenseAliasName } from '../collections/typesense.collections.js'
import { UserRepository } from '../../users/repositories/user.repository.js'
import { ProcessorType, processBatches } from '../../../utils/typeorm/process-batches.js'
import { InOrIgnore } from '../../../utils/query/in-or-ignore.js'
import { type User } from '../../users/entities/user.entity.js'
import { UserTransformer } from '../../users/transformers/user.transformer.js'

@Injectable()
export class TypesenseImportService {
  constructor (
    private readonly typesenseClient: TypesenseClient,
    private readonly userRepository: UserRepository
  ) {}

  public async retrieveCollections (): Promise<CollectionSchema[]> {
    return await this.typesenseClient.client.collections().retrieve()
  }

  public async createCollection (
    aliasName: TypesenseAliasName,
    collection: CollectionCreateSchema
  ): Promise<CollectionSchema> {
    collection.name = `${aliasName}_${dayjs().toISOString()}`
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

  public async retrieveAlias (aliasName: TypesenseAliasName): Promise<CollectionAliasSchema> {
    return await this.typesenseClient.client.aliases(aliasName).retrieve()
  }

  public async retrieveAliases (): Promise<CollectionAliasSchema[]> {
    return (await this.typesenseClient.client.aliases().retrieve()).aliases
  }

  public async linkAlias (aliasName: string, collectionName: string): Promise<void> {
    await this.typesenseClient.client.aliases().upsert(aliasName, {
      collection_name: collectionName
    })
  }

  public async migrate (fresh = false, aliasNames: TypesenseAliasName[]): Promise<void> {
    for (const collectionName of aliasNames) {
      await this.migrateCollection(collectionName, fresh)
    }
  }

  public async migrateCollection (
    aliasName: TypesenseAliasName,
    fresh = false
  ): Promise<void> {
    const collection = typesenseCollections.find(collection => collection.name === aliasName)

    if (collection == null) {
      throw new Error(`Typesense collections with name '${aliasName}' not defined.`)
    }

    const exists = await this.aliasExists(aliasName)

    if (fresh || !exists) {
      const collectionName = (await this.createCollection(aliasName, collection.createSchema)).name

      if (aliasName === TypesenseAliasName.USER) {
        await this.importUsersToTypesense(undefined, collectionName)
      }

      await this.linkAlias(aliasName, collectionName)

      await this.deleteUnusedCollections()
    }
  }

  public async addDocuments <T extends object> (
    aliasName: TypesenseAliasName,
    documents: T[],
    collectionName?: string
  ): Promise<void> {
    for (let i = 0; i < documents.length; i += 100) {
      const documentsChunk = documents.slice(i, i + 100)

      try {
        if (collectionName == null) {
          collectionName = (await this.retrieveAlias(aliasName)).collection_name
        }
        await this.typesenseClient.client.collections(collectionName).documents().import(documentsChunk, { action: 'upsert' })
      } catch (e) {
        captureException(e)
      }
    }
  }

  public async deleteDocument (
    aliasName: TypesenseAliasName,
    uuid: string,
    collectionName?: string
  ): Promise<void> {
    try {
      if (collectionName == null) {
        collectionName = (await this.retrieveAlias(aliasName)).collection_name
      }
      await this.typesenseClient.client.collections(collectionName).documents(uuid).delete()
    } catch (e) {
      captureException(e)
    }
  }

  public async import (aliasNames: TypesenseAliasName[]): Promise<void> {
    if (aliasNames.includes(TypesenseAliasName.USER)) {
      await this.importUsersToTypesense()
    }
  }

  async importUsersToTypesense (
    uuids?: string[],
    collectionName?: string,
    _manager?: EntityManager
  ): Promise<void> {
    await processBatches({
      type: ProcessorType.REPOSITORY,
      repository: this.userRepository,
      find: {
        where: { uuid: InOrIgnore(uuids) }
      },
      handler: async (users: User[]) => {
        await this.addDocuments(
          TypesenseAliasName.USER,
          new UserTransformer().array(users),
          collectionName
        )
      }
    })
  }
}
