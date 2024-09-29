import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from '../guards/auth.guard.js'
import { getPrivateKey, getPublicKey } from '../keys/keys.js'
import { CacheModule } from '../../cache/cache.module.js'
import { PermissionsGuard } from '../../permissions/permissions.guard.js'
import { UserModule } from '../../users/user.module.js'
import { RedisModule } from '../../redis/redis.module.js'

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          privateKey: getPrivateKey(),
          publicKey: getPublicKey()
        }
      }
    }),
    CacheModule,
    RedisModule,
    UserModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard
    }
  ]
})

export class AuthModule {}
