import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { APP_GUARD } from '@nestjs/core'
import { UserModule } from '../../users/user.module.js'
import { User } from '../../users/entities/user.entity.js'
import { AuthController } from '../controllers/auth.controller.js'
import { Client } from '../entities/client.entity.js'
import { Pkce } from '../entities/pkce.entity.js'
import { RefreshToken } from '../entities/refreshtoken.entity.js'
import { ClientService } from '../services/client.service.js'
import { PkceService } from '../services/pkce.service.js'
import { TokenService } from '../services/token.service.js'
import { AuthService } from '../services/auth.service.js'
import { AuthGuard } from '../guards/auth.guard.js'
import { RefreshTokenRepository } from '../repositories/refresh-token.repository.js'
import { PkceRepository } from '../repositories/pkce.repository.js'
import { ClientRepository } from '../repositories/client.repository.js'
import { UserRepository } from '../../users/repositories/user.repository.js'
import { getPrivateKey, getPublicKey } from '../keys/keys.js'
import { AuthMiddleware } from '../middleware/auth.middleware.js'
import { CacheModule } from '../../cache/cache.module.js'
import { PermissionsGuard } from '../../permissions/permissions.guard.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Client, Pkce, RefreshToken]),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          privateKey: getPrivateKey(),
          publicKey: getPublicKey()
        }
      }
    }),
    UserModule,
    CacheModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ClientService,
    PkceService,
    TokenService,
    AuthGuard,
    UserRepository,
    RefreshTokenRepository,
    ClientRepository,
    PkceRepository,
    AuthMiddleware,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard
    }
  ],
  exports: [
    JwtModule,
    AuthService
  ]
})

export class AuthModule {}
