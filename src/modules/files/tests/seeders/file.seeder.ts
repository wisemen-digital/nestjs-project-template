import type { EntityManager } from 'typeorm'
import { FileRepository } from '../../repositories/file.repository.js'
import type { File } from '../../entities/file.entity.js'
import { AbstractSeeder } from '../../../../../test/seeders/abstract-seeder.js'

export class FileSeeder extends AbstractSeeder<File> {
  constructor (
    manager: EntityManager
  ) {
    super(new FileRepository(manager))
  }
}
