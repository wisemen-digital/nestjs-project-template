import { TypesenseCollectionName } from '../enums/typesense-collection-index.enum.js'
import type { Permission } from '../../permissions/permission.enum.js'
import { TypesenseCollection } from './abstract-typesense.collection.js'

export interface UserSearchSchema {
  id: string
  uuid: string
  firstName: string
  lastName: string
  permissions: Permission[]
}

export class UserTypesenseCollection extends TypesenseCollection {
  readonly name = TypesenseCollectionName.USER

  readonly searchableFields = [
    { name: 'firstName', type: 'string', sort: true },
    { name: 'lastName', type: 'string', sort: true }
  ] as const

  readonly filterableFields = [
    { name: 'permissions', type: 'string[]', optional: true }
  ] as const
}
