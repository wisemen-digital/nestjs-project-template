import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { WiseEvent } from './wise-event.js'

@Injectable()
export class EventEmitter {
  constructor (
    private readonly emitter: EventEmitter2
  ) {}

  async emit (event: WiseEvent): Promise<unknown[]> {
    return await this.emitter.emitAsync(event.type, event) as unknown[]
  }
}
