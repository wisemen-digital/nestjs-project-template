import { EntityManager } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { FileLink } from '../entities/file-link.entity.js'
import { TypeOrmRepository } from '../../typeorm/utils/transaction.js'

@Injectable()
export class FileLinkRepository extends TypeOrmRepository<FileLink> {
  constructor (@InjectEntityManager() entityManager: EntityManager) {
    super(FileLink, entityManager)
  }
}
