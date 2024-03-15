import { Injectable } from '@nestjs/common'
import { exhaustiveCheck } from '../../../../utils/helpers/exhaustiveCheck.js'
import { TypesenseAliasName } from '../../enums/typesense-collection.index.enum.js'
import { UserTypesenseCollector } from './user-typesense.collector.js'

@Injectable()
export class TypesenseCollectorFactory {
  constructor (
    private readonly userTypesenseCollector: UserTypesenseCollector
  ) {}

  public create (collection: TypesenseAliasName): TypesenseCollector {
    switch (collection) {
    case TypesenseAliasName.USER:
      return this.userTypesenseCollector
    default: exhaustiveCheck(collection)
    }
  }
}

export interface TypesenseCollector {
  transform: (entities: unknown[]) => object[]

  fetch: (uuids?: string[]) => Promise<unknown[]>
}
