import { Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { type RedisClientOptions } from 'redis'
import { redisStore } from 'cache-manager-redis-store'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RoleRepository } from '../../modules/roles/repositories/role.repository.js'
import { UserRepository } from '../../modules/users/repositories/user.repository.js'
import { RedisCacheService } from './cache.js'

@Module({
  imports: [CacheModule.registerAsync<RedisClientOptions>({
    isGlobal: true,
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      store: await redisStore({
        url: configService.get('REDIS_URL')
      })
    }),
    inject: [ConfigService]
  })],
  controllers: [],
  providers: [RedisCacheService, RoleRepository, UserRepository],
  exports: [RedisCacheService]
})
export class RedisCacheModule {}
