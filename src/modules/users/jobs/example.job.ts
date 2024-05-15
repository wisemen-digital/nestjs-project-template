/* eslint-disable @typescript-eslint/ban-types */
import { JobService, createJob } from '@apricote/nest-pg-boss'
import { Injectable } from '@nestjs/common'
import { Job } from 'pg-boss'
import { Cron } from '@nestjs/schedule'

interface ExampleJobData {
  message: string
}

export const ExampleJob = createJob<ExampleJobData>('example-job')

@Injectable()
export class ExampleJobHandler {
  @ExampleJob.Handle()
  async handleJob (_job: Job<ExampleJobData>): Promise<void> {

  }
}

@Injectable()
export class ExampleCron {
  constructor (
    @ExampleJob.Inject()
    private readonly exampleJobService: JobService<{}>
  ) {}

  @Cron('0 0 1 * * *') // Every day at 01:00
  async handleCron (): Promise<void> {
    await this.exampleJobService.send(
      { message: 'Hello, world!' },
      { singletonKey: 'example-job' }
    )
  }
}
