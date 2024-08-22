import yargs from 'yargs'
import { initSentry } from '../utils/sentry/sentry.js'
import { CronjobFactory, CronJobType } from './cronjobs/factories/cronjob.factory.js'

async function bootstrap (): Promise<void> {
  initSentry()
  const args = await yargs(process.argv)
    .option('job', {
      alias: 'j',
      type: 'string',
      description: 'The name of the cronjob to run',
      choices: Object.values(CronJobType),
      demandOption: true
    })
    .help()
    .argv

  const jobName = args.job
  if (!Object.values(CronJobType).includes(jobName as CronJobType)) {
    throw new Error(`Job ${jobName} not found`)
  }

  const cronjob = CronjobFactory.create(jobName)

  await cronjob.run()
}

await bootstrap()
