import { Interval, Timeout } from '@nestjs/schedule'
import { DataSource } from 'typeorm'
import { captureError } from 'rxjs/internal/util/errorContext'
import { InjectDataSource } from '@nestjs/typeorm'
import { Codec, StringCodec } from 'nats'
import { Inject } from '@nestjs/common'
import { NatsClient } from '../nats.client.js'
import { transaction } from '../../typeorm/utils/transaction.js'
import { NatsOutboxRepository } from './nats-outbox.repository.js'
import { NatsOutboxEvent } from './nats-outbox-event.js'
import natsOutboxPublisherConfig, {
  NatsOutboxPublisherConfig
} from './nats-outbox-publisher.config.js'

export class NatsOutboxPublisher {
  private readonly batchSize: number
  private readonly encoder: Codec<string>

  constructor (
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly outbox: NatsOutboxRepository,
    private readonly natsClient: NatsClient,
    @Inject(natsOutboxPublisherConfig.KEY) private readonly config: NatsOutboxPublisherConfig
  ) {
    this.encoder = StringCodec()
    this.batchSize = this.parseBatchSize(config)
  }

  @Interval(200)
  @Timeout(180)
  async publishOutbox (): Promise<void> {
    const events = await this.outbox.findAndLockUnsentEvents(this.batchSize)

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

  private parseBatchSize (config: NatsOutboxPublisherConfig): number {
    const batchSize = Number(config.batchSize)

    if (isNaN(batchSize) || batchSize < 0 || batchSize > 100000) {
      return 200
    } else {
      return batchSize
    }
  }
}
