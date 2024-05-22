import { TypesenseCollection } from '../enums/typesense-collection-index.enum.js'
import { type Permission } from '../../permissions/permission.enum.js'
import { AbstractTypesenseCollection } from './abstract-typesense.collection.js'

export interface UserSearchSchema {
  id: string
  uuid: string
  firstName: string
  lastName: string
  permissions: Permission[]
}

export class UserTypesenseCollection extends AbstractTypesenseCollection {
  readonly name = TypesenseCollection.USER

  readonly searchableFields = [
    { name: 'firstName', type: 'string', sort: true },
    { name: 'lastName', type: 'string', sort: true }
  ] as const

  readonly filterableFields = [
    { name: 'permissions', type: 'string[]', optional: true, facet: true }
  ] as const
}
