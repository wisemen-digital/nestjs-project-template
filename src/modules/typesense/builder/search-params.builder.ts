import type { SearchParams } from 'typesense/lib/Typesense/Documents.js'
import type { FilterField, SearchField, TypesenseCollection, SortField } from '../collections/abstract-typesense.collection.js'
import type { SortDirection } from '../../../utils/query/search.query.js'
import { FilterOptions } from '../enums/typesense-filter-options.enum.js'

export const DEFAULT_LIMIT = 10
export const DEFAULT_OFFSET = 0

export class TypesenseSearchParamsBuilder<Collection extends TypesenseCollection> {
  private readonly filters: string[] = []
  private queries: string[] = []
  private readonly sorting: string[] = []
  private query: string = ''
  private offset: number = DEFAULT_OFFSET
  private limit: number = DEFAULT_LIMIT

  constructor (private readonly collection: Collection) {}

  withQuery (query: string | undefined): this {
    if (query != null) {
      this.query = query
    }

    return this
  }

  withOffset (offset: number | undefined): this {
    if (offset != null) {
      this.offset = offset
    }

    return this
  }

  withLimit (limit: number | undefined): this {
    if (limit != null) {
      this.limit = limit
    }

    return this
  }

  addSearchOn (searchField: SearchField<Collection> | Array<SearchField<Collection>>): this {
    if (searchField != null) {
      if (Array.isArray(searchField)) {
        this.queries = [...this.queries, ...searchField]
      } else {
        this.queries.push(searchField)
      }
    }

    return this
  }

  addFilterOn (
    filterField: FilterField<Collection>,
    values: string[] | undefined,
    options?: FilterOptions): this {
    if (values !== undefined) {
      this.filters.push(`${filterField}:${this.getOperator(options)}[${values.join(',')}]`)
    }

    return this
  }

  addSortOn (SortField: SortField<Collection>, direction: SortDirection): this {
    this.sorting.push(`${SortField}:${direction}`)

    return this
  }

  build (): SearchParams {
    let queryBy: string = ''

    if (this.queries.length > 0) {
      queryBy = this.queries.join(',')
    } else {
      queryBy = this.collection.searchableFields.join(',')
    }

    const searchParams: SearchParams = {
      q: this.query,
      query_by: queryBy,
      filter_by: this.filters.join(' && '),
      sort_by: this.sorting.join(','),
      offset: this.offset,
      limit: this.limit
    }

    return searchParams
  }

  private getOperator (options?: FilterOptions): string {
    return options ?? FilterOptions.EQUALS
  }
}
