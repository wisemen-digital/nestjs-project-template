import { NestFactory } from '@nestjs/core'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { INestApplicationContext } from '@nestjs/common'
import { WorkerContainer } from '@wisemen/app-container'
import { AppModule } from '../app.module.js'
import { QueueName } from '../modules/pgboss/types/queue-name.enum.js'
import { PgBossWorkerModule } from '../modules/pgboss-worker/pgboss-worker.module.js'

const args = await yargs(hideBin(process.argv))
  .option('queue', {
    alias: 'q',
    type: 'string',
    description: 'The name of the queue to handle',
    choices: Object.values(QueueName),
    demandOption: true
  })
  .help()
  .argv

const queueName = args.queue

if (!Object.values(QueueName).includes(queueName as QueueName)) {
  throw new Error(`Queue ${queueName} not found`)
}
const queue = queueName as QueueName

class Worker extends WorkerContainer {
  async bootstrap (): Promise<INestApplicationContext> {
    return await NestFactory.createApplicationContext(
      AppModule.forRoot([
        PgBossWorkerModule.register(queue)
      ])
    )
  }
}

const _worker = new Worker()
