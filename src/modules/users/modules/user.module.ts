import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PGBossModule } from '@apricote/nest-pg-boss'
import { UserController } from '../controllers/user.controller.js'
import { UserService } from '../services/user.service.js'
import { User } from '../entities/user.entity.js'
import { UserRepository } from '../repositories/user.repository.js'
import { RedisCacheModule } from '../../../utils/cache/cache.module.js'
import { ExampleCron, ExampleJob, ExampleJobHandler } from '../jobs/example.job.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PGBossModule.forJobs([
      ExampleJob
    ]),
    RedisCacheModule
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,

    ExampleJobHandler,
    ExampleCron
  ],
  exports: [UserService]
})
export class UserModule {}
