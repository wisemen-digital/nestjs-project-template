import { Injectable } from '@nestjs/common'
import { WiseEvent } from '../../events/wise-event.js'
import { SubscribeToAll } from '../../events/subscribe.decorator.js'
import { NatsOutboxRepository } from './nats-outbox.repository.js'
import { NatsOutboxEventSerializer } from './nats-outbox-event.serializer.js'

@Injectable()
export class NatsOutboxSubscriber {
  constructor (
    private readonly outbox: NatsOutboxRepository,
    private readonly serializer: NatsOutboxEventSerializer
  ) {}

  @SubscribeToAll()
  async handleEventFired (event: WiseEvent): Promise<void> {
    if (event.isExternal) {
      await this.outbox.insert({
        topic: event.topic,
        serializedMessage: this.serializer.serialize(event)
      })
    }
  }
}
