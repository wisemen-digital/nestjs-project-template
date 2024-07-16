import { type ClassConstructor } from 'class-transformer'
import { Param, type PipeTransform } from '@nestjs/common'
import { type UUID } from './uuid.js'

export function UuidParam<T extends UUID> (
  property: string,
  UuidClass: ClassConstructor<T>
): ParameterDecorator {
  return Param(property, UuidPipeTransformerFactory.create(UuidClass))
}

class UuidPipeTransformerFactory {
  private static readonly cache = new Map<ClassConstructor<UUID>, PipeTransform>()

  static create (UuidClass: ClassConstructor<UUID>): PipeTransform {
    const cachedTransformer = UuidPipeTransformerFactory.cache.get(UuidClass)
    if (cachedTransformer !== undefined) {
      return cachedTransformer
    }

    const newTransformer = {
      transform: (uuid: string) => new UuidClass(uuid)
    }

    UuidPipeTransformerFactory.cache.set(UuidClass, newTransformer)
    return newTransformer
  }
}
