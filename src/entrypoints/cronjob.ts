import { CronjobFactory } from './cronjobs/factories/cronjob.factory.js'

async function bootstrap (jobName: string): Promise<void> {
  const cronjob = CronjobFactory.create(jobName)

  await cronjob.run()
}

await bootstrap(process.argv[2])
