import { EntityManager } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { Pkce } from '../entities/pkce.entity.js'
import { TypeOrmRepository } from '../../../utils/typeorm/transaction.js'

@Injectable()
export class PkceRepository extends TypeOrmRepository<Pkce> {
  constructor (@InjectEntityManager() entityManager: EntityManager) {
    super(Pkce, entityManager)
  }
}
