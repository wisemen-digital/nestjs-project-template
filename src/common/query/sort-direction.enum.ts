export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export function mapSortDirectionToTypeormOrder (direction: SortDirection): 'ASC' | 'DESC' {
  switch (direction) {
  case SortDirection.ASC: return 'ASC'
  case SortDirection.DESC: return 'DESC'
  }
}

export function mapSortDirectionOrUndefinedToTypeormOrder (direction: SortDirection | undefined): 'ASC' | 'DESC' | undefined {
  return direction == null ? undefined : mapSortDirectionToTypeormOrder(direction)
}
