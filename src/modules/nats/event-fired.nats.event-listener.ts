import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { BaseEvent } from '../../utils/events/base-event.js'
import { ALL_TOPICS } from '../events/constants.js'
import { NatsOutboxRepository } from './nats-outbox.repository.js'

@Injectable()
export class EventFiredNatsEventListener {
  constructor (
    private readonly outbox: NatsOutboxRepository
  ) {}

  @OnEvent(ALL_TOPICS, { suppressErrors: false })
  async handleEventFired (event: BaseEvent): Promise<void> {
    console.log('event received')

    if (event.isExternal) {
      await this.outbox.insert(new Array(200).fill({
        topic: event.topic,
        serializedMessage: event.serialize()
      }))

      throw new Error('Failed')
    }
  }
}
