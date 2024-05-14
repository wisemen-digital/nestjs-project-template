import { Column, PrimaryColumn } from 'typeorm'
import { JobState } from '../enums/job-state.enum.js'
import { type JobData } from '../types/job-data.type.js'

export abstract class JobBase {
  @PrimaryColumn('uuid', { name: 'id' })
  uuid: string

  @Column('text')
  name: string

  @Column('int')
  priority: number

  @Column('jsonb', { nullable: true })
  data: JobData | null

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
