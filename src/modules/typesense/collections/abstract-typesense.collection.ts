import type { FieldType, CollectionFieldSchema } from 'typesense/lib/Typesense/Collection.js'
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections.js'

export type SearchField<T extends TypesenseCollection > = T['searchableFields'][number]['name']
export type FilterField<T extends TypesenseCollection> = T['filterableFields'][number]['name'] | SearchField<T>
export type SortField<T extends TypesenseCollection> = Extract<T['searchableFields'][number] | T['filterableFields'][number], { sort: true }>['name']

export interface TypesenseField {
  readonly name: string
  readonly optional?: boolean
  readonly type: FieldType
  readonly sort?: boolean
}

export abstract class TypesenseCollection {
  abstract readonly name: string
  abstract readonly searchableFields: Readonly<TypesenseField[]>
  abstract readonly filterableFields: Readonly<TypesenseField[]>

  public getSchema (): CollectionCreateSchema {
    const searchFields: CollectionFieldSchema[] = this.searchableFields.map(
      field => ({
        name: field.name,
        type: field.type,
        optional: field.optional,
        sort: field.sort
      })
    )
    const filterFields: CollectionFieldSchema[] = this.filterableFields.map(
      field => ({
        name: field.name,
        type: field.type,
        optional: field.optional,
        sort: field.sort,
        facet: true
      })
    )

    return {
      name: this.name,
      fields: [...searchFields, ...filterFields]
    }
  }
}
