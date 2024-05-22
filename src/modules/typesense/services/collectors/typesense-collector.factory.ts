import { Injectable } from '@nestjs/common'
import { TypesenseCollection } from '../../enums/typesense-collection-index.enum.js'
import { exhaustiveCheck } from '../../../../utils/helpers/exhaustive-check.helper.js'
import { UserTypesenseCollector } from './user-typesense.collector.js'

@Injectable()
export class TypesenseCollectorFactory {
  constructor (
    private readonly userTypeSenseCollector: UserTypesenseCollector
  ) {}

  public create (collection: TypesenseCollection): TypesenseCollector {
    switch (collection) {
    case TypesenseCollection.USER:
      return this.userTypeSenseCollector
    default: exhaustiveCheck(collection)
    }
  }
}

export interface TypesenseCollector {
  transform: (entities: unknown[]) => object[]

  fetch: (uuids?: string[]) => Promise<unknown[]>
}
