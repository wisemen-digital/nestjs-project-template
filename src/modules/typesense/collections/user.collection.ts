import { type CollectionCreateSchema } from 'typesense/lib/Typesense/Collections.js'
import { TypesenseAliasName } from '../enums/typesense-collection.index.enum.js'

export interface UserSearchSchema {
  id: string
  uuid: string
  email: string
}

export const userCollection: CollectionCreateSchema = {
  name: TypesenseAliasName.USER,
  fields: [
    { name: 'email', type: 'string', sort: true }
  ]
}
