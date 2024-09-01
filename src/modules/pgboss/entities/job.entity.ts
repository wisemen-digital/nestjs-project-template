import { PrimaryColumn, Column, Entity } from 'typeorm'
import { JobState } from '../types/job-state.enum.js'

@Entity({ name: 'job', schema: 'pgboss', synchronize: false })
export abstract class Job<T> {
  @PrimaryColumn('uuid', { name: 'id' })
  uuid: string

  @Column('text')
  name: string

  @Column('int')
  priority: number

  @Column('jsonb', { nullable: true })
  data: T | null

  @Column({
    type: 'enum',
    enum: JobState
  })
  state: JobState

  @Column('int', { name: 'retrylimit' })
  retryLimit: number

  @Column('int', { name: 'retrycount' })
  retryCount: number

  @Column('int', { name: 'retrydelay' })
  retryDelay: number

  @Column('boolean', { name: 'retrybackoff' })
  retryBackoff: boolean

  @Column('timestamp', { name: 'startafter' })
  startAfter: Date

  @Column('timestamp', { name: 'startedon', nullable: true })
  startedAt: Date | null

  @Column('text', { name: 'singletonkey', nullable: true })
  singletonKey: string | null

  @Column('timestamp', { name: 'createdon' })
  createdAt: Date

  @Column('timestamp', { name: 'completedon', nullable: true })
  completedAt: Date | null

  @Column('jsonb', { nullable: true })
  output: object | null
}
