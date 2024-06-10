import { type JobInsert, type Job } from 'pg-boss'
import { SECONDS_PER_MINUTE } from '@appwise/time'
import { plainToInstance } from 'class-transformer'
import { captureException } from '@sentry/node'
import dayjs from 'dayjs'
import colors from 'colors'
import { type ModuleRef } from '@nestjs/core'
import { type TestingModule } from '@nestjs/testing'
import { type JobSerialization } from '../types/job-serialization.type.js'
import { type QueueName } from '../types/queue-name.enum.js'

export type JobConstructor<T> = new (...args: unknown[]) => PgBossJob<T>

export type PropertiesOnly<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T as T[K] extends Function ? never : K]: T[K]
}

export type CompletedJob<T = unknown> = Job<{
  request: {
    data: JobSerialization<T>
  }
  response: unknown
  failed: boolean
  state: 'completed' | 'expired' | 'cancelled' | 'failed'
  createdOn: string
  startedOn: string
  retryCount: number
  completedOn: string
}>

export abstract class PgBossJob <T = void> {
  protected readonly createdAt = Date.now()
  protected startedAt?: number

  protected abstract readonly queueName: QueueName
  protected readonly onCompleteJob: boolean = false
  protected readonly priority: number = 0
  protected readonly retryLimit: number = 3
  protected readonly retryBackoff: boolean = false
  protected readonly retryDelayInSeconds: number = 10
  protected readonly expireInSeconds: number = 15 * SECONDS_PER_MINUTE
  protected readonly startAfterInSeconds: number = 1

  static create<S extends PgBossJob>(
    this: new () => S,
    options?: PropertiesOnly<S>
  ): S {
    return plainToInstance(this, options ?? {})
  }

  protected get uniqueBy (): string | undefined {
    return undefined
  }

  async execute (moduleRef: ModuleRef | TestingModule): Promise<T> {
    this.startedAt = Date.now()

    this.logStart()

    try {
      const result = await this.run(moduleRef)

      this.logSuccess()

      return result
    } catch (e) {
      this.logFailure(e)
      throw e
    }
  }

  abstract run (moduleRef: ModuleRef | TestingModule): Promise<T>

  async onComplete (_completedJob: CompletedJob): Promise<void> {
    throw new Error('Method not implemented.')
  }

  getName (): string {
    return this.constructor.name
  }

  public serialize (): JobInsert {
    const {
      queueName,
      priority,
      onCompleteJob,
      retryLimit,
      retryBackoff,
      retryDelayInSeconds,
      expireInSeconds,
      startAfterInSeconds,
      ...classData
    } = this

    return {
      priority,
      name: queueName,
      singletonKey: this.uniqueBy,
      data: {
        className: this.constructor.name,
        classData
      },
      retryLimit,
      retryBackoff,
      retryDelay: retryDelayInSeconds,
      startAfter: dayjs().add(startAfterInSeconds, 'seconds').toDate(),
      expireInSeconds,
      onComplete: onCompleteJob
    }
  }

  private logStart (): void {
    if (this.startedAt == null) {
      throw Error('Job has not been started yet')
    }
  }

  protected logSuccess (): void {
    if (this.startedAt == null) throw Error('Job has not been started yet')
    const executionTime = Date.now() - this.startedAt

    // eslint-disable-next-line no-console
    console.info(colors.blue(this.getName()), 'succeeded', `(${executionTime}ms)`)
  }

  protected logFailure (err: Error): void {
    if (this.startedAt == null) throw Error('Job has not been started yet')
    const executionTime = Date.now() - this.startedAt

    captureException(err)

    // eslint-disable-next-line no-console
    console.error(
      colors.blue(this.getName()),
      'failed with error:',
      colors.red(`${err.name}: ${err.message}`),
      `(${executionTime}ms)`
    )
  }
}
