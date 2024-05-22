import { EntityManager, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { FileLink } from '../entities/file-link.entity.js'

@Injectable()
export class FileLinkRepository extends Repository<FileLink> {
  constructor (@InjectEntityManager() entityManager: EntityManager) {
    super(FileLink, entityManager)
  }
}
