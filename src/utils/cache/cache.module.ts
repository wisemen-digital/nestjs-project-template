import { Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { type RedisClientOptions } from 'redis'
import { redisStore } from 'cache-manager-redis-store'
import { RoleRepository } from '../../modules/roles/repositories/role.repository.js'
import { UserRepository } from '../../modules/users/repositories/user.repository.js'
import { RedisCacheService } from './cache.js'

@Module({
  imports: [CacheModule.register<RedisClientOptions>({
    global: true,
    store: redisStore,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  })],
  controllers: [],
  providers: [RedisCacheService, RoleRepository, UserRepository],
  exports: [RedisCacheService]
})
export class RedisCacheModule {}
