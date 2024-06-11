import { plainToInstance } from 'class-transformer'
import type { JobSerialization } from '../types/job-serialization.type.js'
import { type JobConstructor, type PgBossJob } from '../jobs/pgboss.job.js'

export class JobFactory {
  jobConstructors = new Map<string, JobConstructor<unknown>>()

  private static readonly instance = new JobFactory()

  static register<T> (jobConstructor: JobConstructor<T>): void {
    this.instance.register(jobConstructor)
  }

  static make <T> (jobSerialization: JobSerialization<T>): PgBossJob<T> {
    return this.instance.make<T>(jobSerialization)
  }

  private constructor () {}

  register <T> (jobConstructor: JobConstructor<T>): void {
    this.jobConstructors.set(jobConstructor.name, jobConstructor)
  }

  make <T> (jobSerialization: JobSerialization): PgBossJob<T> {
    const JobConstructor = this.jobConstructors.get(jobSerialization.className)

    if (JobConstructor == null) {
      throw new Error(`${jobSerialization.className} is not registered`)
    }

    return plainToInstance(JobConstructor as JobConstructor<T>, jobSerialization.classData)
  }
}
