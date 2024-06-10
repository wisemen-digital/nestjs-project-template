import { Inject, Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import type PgBoss from 'pg-boss'
import { PgBossService } from '../../pgboss/services/pgboss.service.js'
import { QueueName } from '../../pgboss/types/queue-name.enum.js'

@Injectable()
export class WorkerService implements OnModuleInit, OnModuleDestroy {
  constructor (
    private readonly pgBossService: PgBossService,
    @Inject('QUEUE_NAME') private readonly queue: QueueName
  ) {}

  public async onModuleInit (): Promise<void> {
    await this.pgBossService.runQueue(this.queue, this.handleJob)
  }

  public async onModuleDestroy (): Promise<void> {
    await this.pgBossService.stopQueue()
  }

  private async handleJob (job: PgBoss.Job): Promise<void> {
    // eslint-disable-next-line no-console
    console.log('Job received:', job.data)
  }
}
