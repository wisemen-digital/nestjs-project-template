import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app.module.js'
import { initSentry } from '../helpers/sentry.js'
import { PgBossWorkerModule } from '../modules/pgboss-worker/pgboss-worker.module.js'
import { QueueName } from '../modules/pgboss/types/queue-name.enum.js'

function getArgumentValue (argName: string): string | undefined {
  const index = process.argv.findIndex(arg => arg.startsWith(`--${argName}=`))
  if (index === -1) return undefined
  return process.argv[index].replace(`--${argName}=`, '')
}

async function bootstrap (): Promise<void> {
  initSentry()

  const queueName = getArgumentValue('queue')
  if (queueName == null) throw new Error('The \'queue\' argument is required')
  if (!Object.values(QueueName).includes(queueName as QueueName)) throw new Error(`Queue ${queueName} not found`)
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
