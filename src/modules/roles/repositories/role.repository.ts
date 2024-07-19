import { EntityManager } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { Role } from '../entities/role.entity.js'
import { TypeOrmRepository } from '../../../utils/typeorm/transaction.js'

@Injectable()
export class RoleRepository extends TypeOrmRepository<Role> {
  constructor (@InjectEntityManager() entityManager: EntityManager) {
    super(Role, entityManager)
  }
}
