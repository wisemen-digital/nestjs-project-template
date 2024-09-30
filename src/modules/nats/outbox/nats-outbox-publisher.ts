import { Interval, Timeout } from '@nestjs/schedule'
import { DataSource } from 'typeorm'
import { captureError } from 'rxjs/internal/util/errorContext'
import { InjectDataSource } from '@nestjs/typeorm'
import { Codec, StringCodec } from 'nats'
import { NatsClient } from '../nats.client.js'
import { transaction } from '../../typeorm/utils/transaction.js'
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
    const events = await this.outbox.findAndLockUnsentEvents(NatsOutboxPublisher.BATCH_SIZE)

    if (events.length === 0) {
      return
    }

    const publishedEvents = this.publishEvents(events)
    const publishedEventUuids = new Set(publishedEvents.map(event => event.uuid))
    const unpublishedEvents = events.filter(event => !publishedEventUuids.has(event.uuid))

    await transaction(this.dataSource, async () => {
      await Promise.all([
        this.outbox.complete(publishedEvents),
        this.outbox.reset(unpublishedEvents)
      ])
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
