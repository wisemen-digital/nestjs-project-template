import { Injectable } from '@nestjs/common'
import { BaseEvent } from '../../../utils/events/base-event.js'
import { SubscribeToAll } from '../../events/subscribe.decorator.js'
import { NatsOutboxRepository } from './nats-outbox.repository.js'

@Injectable()
export class NatsOutboxSubscriber {
  constructor (
    private readonly outbox: NatsOutboxRepository
  ) {}

  @SubscribeToAll()
  async handleEventFired (event: BaseEvent): Promise<void> {
    console.log('event received')

    if (event.isExternal) {
      await this.outbox.insert(new Array(500).fill({
        topic: event.topic,
        serializedMessage: event.serialize()
      }))
    }
  }
}
