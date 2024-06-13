import { EntityManager } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { File } from '../entities/file.entity.js'
import { TypeOrmRepository } from '../../typeorm/utils/transaction.js'

@Injectable()
export class FileRepository extends TypeOrmRepository<File> {
  constructor (@InjectEntityManager() entityManager: EntityManager) {
    super(File, entityManager)
  }
}
