import { SortDirection } from '../../query/search.query.js'

export function typeormOrder (direction: SortDirection): 'ASC' | 'DESC'
export function typeormOrder (direction: undefined): undefined
export function typeormOrder (direction: SortDirection | undefined): 'ASC' | 'DESC' | undefined
export function typeormOrder (direction: SortDirection | undefined): 'ASC' | 'DESC' | undefined {
  switch (direction) {
    case SortDirection.ASC: return 'ASC'
    case SortDirection.DESC: return 'DESC'
    default: return undefined
  }
}
