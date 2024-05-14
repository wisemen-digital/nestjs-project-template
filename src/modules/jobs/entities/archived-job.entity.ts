import { Column, Entity } from 'typeorm'
import { JobBase } from './job-base.entity.js'

@Entity({ name: 'archive', schema: 'pgboss', synchronize: false })
export class ArchivedJob extends JobBase {
  @Column('timestamp', { name: 'archivedon' })
  archivedAt: Date
}
