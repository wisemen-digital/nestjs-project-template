import type { ValueTransformer } from 'typeorm'
import { type ClassConstructor } from 'class-transformer'
import { type UUID } from '../uuid/uuid.js'

export class UuidTypeormTransformerFactory {
  private static readonly cache = new Map<ClassConstructor<UUID>, ValueTransformer>()

  static create (UuidClass: ClassConstructor<UUID>): ValueTransformer {
    const cachedTransformer = UuidTypeormTransformerFactory.cache.get(UuidClass)
    if (cachedTransformer !== undefined) {
      return cachedTransformer
    }

    const newTransformer = {
      to: (value: UUID<string>) => value.toString(),
      from: (value: string) => new UuidClass(value)
    }

    UuidTypeormTransformerFactory.cache.set(UuidClass, newTransformer)
    return newTransformer
  }
}
