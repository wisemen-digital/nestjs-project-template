import { type EntityManager } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { type User } from '../../../users/entities/user.entity.js'
import { TokenService } from '../../services/token.service.js'
import { RefreshTokenRepository } from '../../repositories/refresh-token.repository.js'
import { getPrivateKey, getPublicKey } from '../../../../common/auth/keys.js'
import { type Client } from '../../entities/client.entity.js'

export class TokenSeeder {
  private readonly tokenService: TokenService

  constructor (manager: EntityManager) {
    this.tokenService = new TokenService(
      new RefreshTokenRepository(manager),
      new JwtService({
        privateKey: getPrivateKey(),
        publicKey: getPublicKey()
      })
    )
  }

  public async seedOne (user: User, client: Client): Promise<string> {
    return await this.tokenService.generateAccessToken(client, user, ['read', 'write'])
  }
}
