import { type CollectionCreateSchema } from 'typesense/lib/Typesense/Collections.js'

export enum TypesenseAliasName {
  USER = 'user'
}

interface CollectionDetails {
  name: TypesenseAliasName
  createSchema: CollectionCreateSchema
}

export const typesenseCollections: CollectionDetails[] = [
  {
    name: TypesenseAliasName.USER,
    createSchema: {
      name: TypesenseAliasName.USER,
      fields: [
        { name: 'email', type: 'string', sort: true }
      ]
    }
  }
]
