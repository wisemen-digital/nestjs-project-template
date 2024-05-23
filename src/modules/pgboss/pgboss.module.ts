import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PgBossService } from './services/pgboss.service.js'
import { PgBossClient } from './services/pgboss.client.js'
import { WorkerService } from './services/worker.service.js'
import { Job } from './entities/job.entity.js'
import { ArchivedJob } from './entities/archive.entity.js'
import { type PgBossJob } from './jobs/pgboss.job.js'

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Job, ArchivedJob])
  ],
  providers: [
    PgBossClient,
    PgBossService,
    WorkerService
  ],
  exports: [PgBossService]
})
export class PgBossModule {
  static registerJob (_jobs: PgBossJob[]): PgBossModule {
    return this
  }
}
