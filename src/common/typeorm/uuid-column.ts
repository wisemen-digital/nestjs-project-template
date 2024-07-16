import type { Constructor } from '@nestjs/common/utils/merge-with-values.util.js'
import { Column } from 'typeorm'
import { type UUID } from '../uuid/uuid.js'
import { UuidTransformerFactory } from './uuid-transformer.js'

type UuidColumnOptions = Exclude<Parameters<typeof Column>[1], 'type'>

export function UuidColumn<T extends UUID<string>> (
  UuidClass: Constructor<T>,
  options?: UuidColumnOptions
): PropertyDecorator {
  return Column('uuid', {
    ...options,
    transformer: UuidTransformerFactory.create(UuidClass)
  })
}
