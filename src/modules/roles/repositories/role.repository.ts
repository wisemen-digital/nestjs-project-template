import { EntityManager, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { Role } from '../entities/role.entity.js'

@Injectable()
export class RoleRepository extends Repository<Role> {
  constructor (@InjectEntityManager() entityManager: EntityManager) {
    super(Role, entityManager)
  }
}
