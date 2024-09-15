import { Interval, Timeout } from '@nestjs/schedule'
import { DataSource } from 'typeorm'
import { captureError } from 'rxjs/internal/util/errorContext'
import { InjectDataSource } from '@nestjs/typeorm'
import { Codec, StringCodec } from 'nats'
import { transaction } from '../../typeorm/utils/transaction.js'
import { NatsClient } from '../nats.client.js'
import { NatsOutboxRepository } from './nats-outbox.repository.js'
import { NatsOutboxEvent } from './nats-outbox-event.js'

export class NatsOutboxPublisher {
  private static BATCH_SIZE = 200
  private encoder: Codec<string>

  constructor (
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly outbox: NatsOutboxRepository,
    private readonly natsClient: NatsClient
  ) {
    this.encoder = StringCodec()
  }

  @Interval(200)
  @Timeout(180)
  async publishOutbox (): Promise<void> {
    await transaction(this.dataSource, async () => {
      const events = await this.outbox.findAndLockUnsentEvents(NatsOutboxPublisher.BATCH_SIZE)

      if (events.length === 0) {
        return
      }

      const publishedEvents = this.publishEvents(events)

      await this.outbox.complete(publishedEvents)
    })
  }

  private publishEvents (events: NatsOutboxEvent[]): NatsOutboxEvent[] {
    const publishedEvents: NatsOutboxEvent[] = []

    try {
      for (const event of events) {
        this.natsClient.publish(event.topic, this.encoder.encode(event.serializedMessage))
        publishedEvents.push(event)
      }
    } catch (e) {
      captureError(e)
    }

    return publishedEvents
  }
}
