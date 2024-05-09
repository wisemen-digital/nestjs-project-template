import { Injectable } from '@nestjs/common'
import { type ObjectLiteral } from 'typeorm'
import { type CreateFileLinkDto } from '../dtos/create-file-entity.dto.js'
import { type FileLink } from '../entities/file-link.entity.js'
import { FileLinkRepository } from '../repositories/file-link.repository.js'

@Injectable()
export class FileLinkService {
  constructor (
    private readonly fileLinkRepository: FileLinkRepository
  ) {}

  async create (
    dto: CreateFileLinkDto,
    collectionName: string,
    entityUuid: string,
    entityType: string
  ): Promise<FileLink> {
    const file = this.fileLinkRepository.create({
      ...dto,
      collectionName,
      entityUuid,
      entityType
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

  async sync<T extends ObjectLiteral> (
    dtos: CreateFileLinkDto[],
    collectionName: keyof T,
    entityUuid: string,
    entityType: string
  ): Promise<void> {
    const collectionNameString = collectionName.toString()
    const existingFileLinks = await this.fileLinkRepository.find({
      where: {
        collectionName: collectionNameString,
        entityUuid,
        entityType
      }
    })

    // Remove FileLinks that are no longer included
    const removeFileLinks = existingFileLinks.filter(
      (existing) => !dtos.some(
        (dto) => dto.fileUuid === existing.fileUuid
      )
    )
    for (const fileLink of removeFileLinks ?? []) {
      await this.fileLinkRepository.remove(fileLink)
    }

    // Create or update included FileLinks
    for (const dto of dtos) {
      const existingFileLink = existingFileLinks.find(
        (FileLink) => FileLink.fileUuid === dto.fileUuid
      )

      if (existingFileLink == null) {
        await this.create(dto, collectionNameString, entityUuid, entityType)
      } else {
        await this.update(existingFileLink, dto)
      }
    }
  }
}
