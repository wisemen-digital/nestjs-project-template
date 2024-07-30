import { EntityManager } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { RefreshToken } from '../entities/refreshtoken.entity.js'
import { TypeOrmRepository } from '../../../utils/typeorm/transaction.js'

@Injectable()
export class RefreshTokenRepository extends TypeOrmRepository<RefreshToken> {
  constructor (@InjectEntityManager() entityManager: EntityManager) {
    super(RefreshToken, entityManager)
  }
}
