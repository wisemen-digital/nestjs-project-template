import { Inject, Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import type PgBoss from 'pg-boss'
import { ModuleRef } from '@nestjs/core'
import { PgBossService } from '../../pgboss/services/pgboss.service.js'
import { QueueName } from '../../pgboss/types/queue-name.enum.js'
import { JobFactory } from '../../pgboss/factories/job-factory.js'
import { type JobSerialization } from '../../pgboss/types/job-serialization.type.js'

@Injectable()
export class WorkerService implements OnModuleInit, OnModuleDestroy {
  constructor (
    @Inject('QUEUE_NAME') private readonly queue: QueueName,
    private readonly pgBossService: PgBossService,
    private readonly moduleRef: ModuleRef
  ) {}

  public async onModuleInit (): Promise<void> {
    await this.pgBossService.runQueue(this.queue,
      async (job: PgBoss.Job<JobSerialization<unknown>>) => {
        await this.handleJob(job)
      }
    )
  }

  public async onModuleDestroy (): Promise<void> {
    await this.pgBossService.stopQueue()
  }

  private async handleJob (job: PgBoss.Job<JobSerialization<unknown>>): Promise<void> {
    // eslint-disable-next-line no-console
    console.log('Job received:', job.data)

    const jobInstance = JobFactory.make(job.data)
    await jobInstance.execute(this.moduleRef)
  }
}
