import { Injectable } from '@nestjs/common'
import { EntityManager, In } from 'typeorm'
import { TypeOrmRepository } from '../../typeorm/utils/transaction.js'
import { NatsOutboxEvent, NatsEventOutboxState } from './nats-outbox-event.js'

@Injectable()
export class NatsOutboxRepository extends TypeOrmRepository<NatsOutboxEvent> {
  constructor (entityManager: EntityManager) {
    super(NatsOutboxEvent, entityManager)
  }

  async findAndLockUnsentEvents (limit: number = 100): Promise<NatsOutboxEvent[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [events, _] = await this.manager.query(`
      WITH next as (
        SELECT uuid
        FROM nats_event_outbox
        WHERE 
          state = '${NatsEventOutboxState.PENDING}'
          ORDER BY "createdAt"
        LIMIT ${limit}
        FOR UPDATE SKIP LOCKED
      )
      UPDATE nats_event_outbox SET
        state = '${NatsEventOutboxState.SENDING}'
      FROM next
      WHERE nats_event_outbox.uuid = next.uuid
      RETURNING *  
    `)

    return events as NatsOutboxEvent[]
  }

  async complete (events: NatsOutboxEvent[]): Promise<void> {
    await this.update(
      { uuid: In(events.map(event => event.uuid)) },
      { sentAt: new Date(), state: NatsEventOutboxState.SENT }
    )
  }
}
