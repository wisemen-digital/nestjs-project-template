import { Injectable, type OnModuleInit } from '@nestjs/common'
import type PgBoss from 'pg-boss'
import { JobQueue } from '../types/job-queue.enum.js'
import { PgBossService } from './pgboss.service.js'

@Injectable()
export class WorkerService implements OnModuleInit {
  constructor (
    private readonly pgBossService: PgBossService
  ) {}

  public async onModuleInit (): Promise<void> {
    await this.pgBossService.runQueue(JobQueue.SYSTEM, this.handleJob)

    await this.scheduleMyJob()
  }

  private async handleJob (job: PgBoss.Job): Promise<void> {
    // eslint-disable-next-line no-console
    console.log('Job received:', job.data)
  }

  public async scheduleMyJob (): Promise<void> {
    await this.pgBossService.scheduleJob('job-1', { foo: 'bar' })
  }
}
