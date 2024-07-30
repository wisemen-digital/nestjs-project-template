import { Module } from '@nestjs/common'
import { RoleRepository } from '../roles/repositories/role.repository.js'
import { UserRepository } from '../users/repositories/user.repository.js'
import { RedisModule } from '../redis/redis.module.js'
import { CacheService } from './services/cache.service.js'

@Module({
  imports: [
    RedisModule.forRoot()
  ],
  controllers: [],
  providers: [
    CacheService,
    RoleRepository,
    UserRepository
  ],
  exports: [
    CacheService
  ]
})
export class CacheModule {}
