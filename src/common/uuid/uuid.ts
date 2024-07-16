import { randomUUID } from 'crypto'
import { isUUID } from 'class-validator'

export class UUID<Brand extends string> {
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

  equals (otherUuid: UUID<Brand>): boolean {
    return otherUuid.uuid === this.uuid
  }

  toString (): string {
    return this.uuid
  }
}
