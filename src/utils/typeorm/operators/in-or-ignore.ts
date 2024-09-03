import type { FindOperator } from 'typeorm'
import { In } from 'typeorm'

export function InOrIgnore<T> (values?: T[]): FindOperator<T> | undefined {
  return values != null ? In(values) : undefined
}
