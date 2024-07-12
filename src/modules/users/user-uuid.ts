import { randomUUID } from 'crypto'
import { isUUID } from 'class-validator'
import { Column, type ValueTransformer } from 'typeorm'
import { type Constructor } from '@nestjs/common/utils/merge-with-values.util.js'
import {
  type PrimaryGeneratedColumnUUIDOptions
} from 'typeorm/decorator/options/PrimaryGeneratedColumnUUIDOptions'

export class UUID<T extends UUID<T, Brand>, Brand extends string> {
  private readonly uuid: string
  private readonly _brand: Brand
  constructor (uuid?: string) {
    if (uuid !== undefined && !isUUID(uuid)) {
      throw new Error('Invalid uuid')
    } else if (uuid !== undefined) {
      this.uuid = uuid
    } else {
      this.uuid = randomUUID()
    }
  }

  equals (otherUuid: T): boolean {
    return otherUuid.uuid === this.uuid
  }

  toString (): string {
    return this.uuid
  }
}

export class UserUuid extends UUID<UserUuid, 'UserUuid'> {}

export class DuckUuid extends UUID<DuckUuid, 'DuckUuid'> {}

const duckUuid = new DuckUuid()
const userUuid = new UserUuid()


duckUuid.equals(userUuid)

function createUuidTransformer<T extends UUID<T, U>, U extends string> (UuidClass: Constructor<T>): ValueTransformer {
  return {
    to: (value: T) => value.toString(),
    from: (value: string) => new UuidClass(value)
  }
}

export function PrimaryGeneratedUuidColumn<T extends UUID<T, U>, U extends string> (
  UuidClass: Constructor<T>,
  options?: PrimaryGeneratedColumnUUIDOptions
): PropertyDecorator {
  return Column('uuid', {
    ...options,
    generated: 'uuid',
    primary: true,
    transformer: createUuidTransformer(UuidClass)
  })
}
