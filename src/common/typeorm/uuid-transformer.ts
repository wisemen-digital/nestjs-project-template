import type { ValueTransformer } from 'typeorm'
import { type ClassConstructor } from 'class-transformer'
import { type UUID } from '../uuid/uuid.js'

type AnyUuid = ClassConstructor<UUID<string>>

export class UuidTransformerFactory {
  private static readonly cache = new Map<AnyUuid, ValueTransformer>()

  static create (UuidClass: AnyUuid): ValueTransformer {
    const cachedTransformer = UuidTransformerFactory.cache.get(UuidClass)
    if (cachedTransformer !== undefined) {
      return cachedTransformer
    }

    const newTransformer = {
      to: (value: UUID<string>) => value.toString(),
      from: (value: string) => new UuidClass(value)
    }

    UuidTransformerFactory.cache.set(UuidClass, newTransformer)
    return newTransformer
  }
}
