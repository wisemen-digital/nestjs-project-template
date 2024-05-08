import { EntityManager, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { FileEntity } from '../entities/file-entity.entity.js'

@Injectable()
export class FileEntityRepository extends Repository<FileEntity> {
  constructor (@InjectEntityManager() entityManager: EntityManager) {
    super(FileEntity, entityManager)
  }
}
