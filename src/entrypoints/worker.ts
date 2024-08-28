import { NestFactory } from '@nestjs/core'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { AppModule } from '../app.module.js'
import { QueueName } from '../modules/pgboss/types/queue-name.enum.js'
import { initSentry } from '../utils/sentry/sentry.js'
import { PgBossWorkerModule } from '../modules/pgboss-worker/pgboss-worker.module.js'

async function bootstrap (): Promise<void> {
  initSentry()

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

  const app = await NestFactory.createApplicationContext(
    AppModule.forRoot([
      PgBossWorkerModule.register(queue)
    ])
  )

  app.enableShutdownHooks()

  await app.init()
}

await bootstrap()
