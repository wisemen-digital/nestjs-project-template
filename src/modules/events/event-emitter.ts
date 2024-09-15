import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { BaseEvent } from '../../utils/events/base-event.js'

@Injectable()
export class EventEmitter {
  constructor (
    private readonly emitter: EventEmitter2
  ) {}

  async emit (event: BaseEvent): Promise<unknown[]> {
    return await this.emitter.emitAsync(event.topic, event) as unknown[]
  }
}
