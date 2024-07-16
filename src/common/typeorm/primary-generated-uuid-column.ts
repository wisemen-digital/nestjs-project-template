import type { Constructor } from '@nestjs/common/utils/merge-with-values.util.js'
import { Column, type PrimaryGeneratedColumn } from 'typeorm'
import { type UUID } from '../uuid/uuid.js'
import { UuidTypeormTransformerFactory } from './uuid-transformer.js'

type PrimaryGeneratedUuidColumnOptions = Parameters<typeof PrimaryGeneratedColumn>[1]

export function PrimaryGeneratedUuidColumn<T extends UUID> (
  UuidClass: Constructor<T>,
  options?: PrimaryGeneratedUuidColumnOptions
): PropertyDecorator {
  return Column('uuid', {
    ...options,
    generated: 'uuid',
    primary: true,
    transformer: UuidTypeormTransformerFactory.create(UuidClass)
  })
}
