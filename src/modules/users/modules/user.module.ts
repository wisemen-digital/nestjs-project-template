import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from '../controllers/user.controller.js'
import { UserService } from '../services/user.service.js'
import { User } from '../entities/user.entity.js'
import { UserRepository } from '../repositories/user.repository.js'
import { RedisCacheModule } from '../../../utils/cache/cache.module.js'
import { PgBossModule } from '../../pgboss/pgboss.module.js'
import { UserTypesenseJob } from '../jobs/user-typesense.job.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RedisCacheModule,
    PgBossModule.registerJob([UserTypesenseJob])
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository
  ],
  exports: [UserService]
})
export class UserModule {}
