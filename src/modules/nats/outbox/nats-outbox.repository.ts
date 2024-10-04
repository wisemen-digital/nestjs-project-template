import { Injectable } from '@nestjs/common'
import { DataSource, EntityManager, In } from 'typeorm'
import { InjectDataSource } from '@nestjs/typeorm'
import { transaction, TypeOrmRepository } from '../../typeorm/utils/transaction.js'
import { NatsOutboxEvent, NatsEventOutboxState } from './nats-outbox-event.js'

@Injectable()
export class NatsOutboxRepository extends TypeOrmRepository<NatsOutboxEvent> {
  constructor (
    entityManager: EntityManager,
    @InjectDataSource() private readonly dataSource: DataSource
  ) {
    super(NatsOutboxEvent, entityManager)
  }

  async findAndLockUnsentEvents (limit: number = 100): Promise<NatsOutboxEvent[]> {
    return await transaction(this.dataSource, async () => {
      const [events, _] = await this.manager.query<[NatsOutboxEvent[], number]>(`
        WITH next as (
          SELECT uuid
          FROM nats_outbox_event
          WHERE 
            state = '${NatsEventOutboxState.PENDING}'
            ORDER BY "createdAt"
          LIMIT ${limit}
          FOR UPDATE SKIP LOCKED
        )
        UPDATE nats_outbox_event SET
          state = '${NatsEventOutboxState.SENDING}'
        FROM next
        WHERE nats_outbox_event.uuid = next.uuid
        RETURNING *  
      `)

      return events
    })
  }

  async complete (events: NatsOutboxEvent[]): Promise<void> {
    await this.update(
      { uuid: In(events.map(event => event.uuid)) },
      { sentAt: new Date(), state: NatsEventOutboxState.SENT }
    )
  }

  async reset (events: NatsOutboxEvent[]): Promise<void> {
    await this.update(
      { uuid: In(events.map(event => event.uuid)) },
      { state: NatsEventOutboxState.PENDING }
    )
  }
}
