import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { TypeOrmRepository } from '../typeorm/utils/transaction.js'
import { NatsEventOutbox, NatsEventOutboxState } from './models/nats-event-outbox.js'

@Injectable()
export class NatsOutboxRepository extends TypeOrmRepository<NatsEventOutbox> {
  constructor (entityManager: EntityManager) {
    super(NatsEventOutbox, entityManager)
  }

  async findAndLockUnsentEvents (limit: number = 100): Promise<NatsEventOutbox[]> {
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

    return events as NatsEventOutbox[]
  }

  async complete (events: NatsEventOutbox[]): Promise<void> {
    await this.upsert(events, { conflictPaths: { uuid: true } })
  }
}
