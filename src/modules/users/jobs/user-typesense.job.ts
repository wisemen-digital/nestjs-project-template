import { PgBossJob } from '../../pgboss/jobs/pgboss.job.js'
import { QueueName } from '../../pgboss/types/queue-name.enum.js'

export class UserTypesenseJob extends PgBossJob {
  protected readonly queueName = QueueName.SYSTEM

  async run (): Promise<void> {
    console.log('UserTypesenseJob')
  }
}
