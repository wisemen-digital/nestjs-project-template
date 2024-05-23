import { PgBossJob } from '../../pgboss/jobs/pgboss.job.js'
import { JobQueue } from '../../pgboss/types/job-queue.enum.js'

export class UserTypesenseJob extends PgBossJob {
  protected readonly queueName = JobQueue.SYSTEM

  async run (): Promise<void> {
    console.log('UserTypesenseJob')
  }
}
