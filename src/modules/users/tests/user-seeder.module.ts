import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { User } from '../entities/user.entity.js'
import { TokenService } from '../../auth/services/token.service.js'
import { ClientSeeder } from '../../auth/tests/client.seeder.js'
import { UserRepository } from '../repositories/user.repository.js'
import { Client } from '../../auth/entities/client.entity.js'
import { RefreshToken } from '../../auth/entities/refreshtoken.entity.js'
import { ClientRepository } from '../../auth/repositories/client.repository.js'
import { RefreshTokenRepository } from '../../auth/repositories/refresh-token.repository.js'
import { getPrivateKey, getPublicKey } from '../../../utils/auth/keys.js'
import { UserSeeder } from './user.seeder.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Client, RefreshToken]),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          privateKey: getPrivateKey(),
          publicKey: getPublicKey()
        }
      }
    })
  ],
  providers: [
    UserSeeder,
    TokenService,
    ClientSeeder,
    UserRepository,
    ClientRepository,
    RefreshTokenRepository
  ],
  exports: [UserSeeder, JwtModule]
})
export class UserSeederModule {}
