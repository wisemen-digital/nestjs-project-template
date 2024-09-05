import type { DynamicModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArchivedJob } from '../entities/archive.entity.js'
import { Job } from '../entities/job.entity.js'
import { JobFactory } from '../factories/job-factory.js'
import type { JobConstructor } from '../jobs/pgboss.job.js'
import { PgBossClientService } from '../services/pgboss-client.service.js'
import { PgBossService } from '../services/pgboss.service.js'

export class PgBossModule {
  static forRoot (): DynamicModule {
    return {
      module: PgBossModule,
      imports: [
        TypeOrmModule.forFeature([Job, ArchivedJob])
      ],
      providers: [
        PgBossClientService,
        PgBossService
      ],
      exports: [PgBossService]
    }
  }

  static forFeature (jobs: Array<JobConstructor<unknown>>): DynamicModule {
    jobs.forEach((job) => {
      JobFactory.register(job)
    })

    return this.forRoot()
  }
}
