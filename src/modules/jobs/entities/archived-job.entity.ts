import { Column, Entity } from 'typeorm'
import { Job } from './job.entity.js'

@Entity({ name: 'archive', schema: 'pgboss', synchronize: false })
export class ArchivedJob extends Job {
  @Column('timestamp', { name: 'archivedon' })
  archivedAt: Date
}
