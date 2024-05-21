import { EntityManager, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { File } from '../entities/file.entity.js'

@Injectable()
export class FileRepository extends Repository<File> {
  constructor (@InjectEntityManager() entityManager: EntityManager) {
    super(File, entityManager)
  }
}
