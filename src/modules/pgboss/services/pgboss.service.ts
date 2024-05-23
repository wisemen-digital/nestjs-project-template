import { Injectable } from '@nestjs/common'
import type PgBoss from 'pg-boss'
import { type EntityManager } from 'typeorm'
import { type PgBossJob } from '../jobs/pgboss.job.js'
import { PgBossClient } from './pgboss.client.js'

@Injectable()
export class PgBossService {
  constructor (
    private readonly boss: PgBossClient
  ) {}

  public async scheduleJob (
    name: string,
    data: object,
    options?: PgBoss.SendOptions
  ): Promise<string | null> {
    return await this.boss.send(name, data, options ?? {})
  }

  public async scheduleJobs <T extends PgBossJob> (
    _manager: EntityManager,
    jobs: T[]
  ): Promise<void> {
    await this.boss.insert(
      jobs.map(job => job.serialize())
    )
  }

  public async runQueue (
    name: string,
    handler: (job: PgBoss.Job) => Promise<void>
  ): Promise<void> {
    await this.boss.work(name, async (job: PgBoss.Job) => {
      await handler(job)
    })
  }
}
