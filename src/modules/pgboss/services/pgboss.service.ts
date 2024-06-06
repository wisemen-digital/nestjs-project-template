import { Injectable } from '@nestjs/common'
import type PgBoss from 'pg-boss'
import { type EntityManager } from 'typeorm'
import { type PgBossJob } from '../jobs/pgboss.job.js'
import { PgBossClientService } from './pgboss-client.service.js'

@Injectable()
export class PgBossService {
  constructor (
    private readonly boss: PgBossClientService
  ) {}

  public async scheduleJobs <T extends PgBossJob> (
    manager: EntityManager,
    jobs: T[]
  ): Promise<void> {
    const options: PgBoss.ConnectionOptions = {
      db: {
        async executeSql (text, values) {
          const result = await manager.query(text, values)

          return {
            rows: result,
            rowCount: result.length
          }
        }
      }
    }

    await this.boss.insert(jobs.map(job => job.serialize()), options)
  }

  public async runQueue (
    name: string,
    handler: (job: PgBoss.Job) => Promise<void>
  ): Promise<void> {
    await this.boss.work(name, async (job: PgBoss.Job) => {
      await handler(job)
    })
  }

  public async stopQueue (): Promise<void> {
    await this.boss.stop({
      destroy: true
    })
  }
}
