import { Entity } from 'typeorm'
import { JobBase } from './job-base.entity.js'

@Entity({ name: 'job', schema: 'pgboss', synchronize: false })
export class Job extends JobBase {}
