import { Module } from '@nestjs/common'
import { RoleRepository } from '../roles/repositories/role.repository.js'
import { UserRepository } from '../users/repositories/user.repository.js'
import { CacheService } from '../cache/cache.service.js'
import { RedisModule } from '../redis/redis.module.js'

@Module({
  imports: [
    // NatsModule.forRoot(),
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
