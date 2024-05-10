import { Injectable } from '@nestjs/common'
import { DataSource, In } from 'typeorm'
import { type CreateFileLinkDto } from '../dtos/create-file-entity.dto.js'
import { type FileLink } from '../entities/file-link.entity.js'
import { FileLinkRepository } from '../repositories/file-link.repository.js'

@Injectable()
export class FileLinkService {
  constructor (
    private readonly dataSource: DataSource,
    private readonly fileLinkRepository: FileLinkRepository
  ) {}

  async create (
    dto: CreateFileLinkDto,
    entityUuid: string,
    entityType: string,
    entityPart: string
  ): Promise<FileLink> {
    const file = this.fileLinkRepository.create({
      ...dto,
      entityUuid,
      entityType,
      entityPart
    })

    await this.fileLinkRepository.insert(file)

    return file
  }

  async update (
    link: FileLink,
    dto: CreateFileLinkDto
  ): Promise<void> {
    await this.fileLinkRepository.update({
      uuid: link.uuid
    }, dto)
  }

  async sync (
    dtos: CreateFileLinkDto[],
    entityUuid: string,
    entityType: string,
    entityPart: string
  ): Promise<void> {
    const previousFileLinks = await this.fileLinkRepository.find({
      where: {
        entityPart,
        entityUuid,
        entityType
      }
    })

    await this.dataSource.transaction(async manager => {
      const fileLinkRepository = new FileLinkRepository(manager)

      const removedFileLinks = previousFileLinks.filter(existing => {
        return !dtos.some(dto => dto.fileUuid === existing.fileUuid)
      })

      const upsertFileLinks = dtos.map(dto => {
        const existing = previousFileLinks.find(link => {
          return link.fileUuid === dto.fileUuid
        })

        return {
          ...dto,
          uuid: existing?.uuid
        }
      })

      await fileLinkRepository.delete({
        uuid: In(removedFileLinks.map((link) => link.uuid))
      })

      await fileLinkRepository.upsert(
        upsertFileLinks,
        ['uuid']
      )
    })
  }
}
