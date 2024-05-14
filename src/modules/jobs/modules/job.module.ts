import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArchivedJob } from '../entities/archived-job.entity.js'
import { Job } from '../entities/job.entity.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Job,
      ArchivedJob
    ])
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class JobModule {}
