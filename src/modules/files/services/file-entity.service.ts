import { Injectable } from '@nestjs/common'
import { type ObjectLiteral } from 'typeorm'
import { type FileEntity } from '../entities/file-entity.entity.js'
import { FileEntityRepository } from '../repositories/file-entity.repository.js'
import { type CreateFileEntityDto } from '../dtos/create-file-entity.dto.js'

@Injectable()
export class FileEntityService {
  constructor (
    private readonly fileEntityRepository: FileEntityRepository
  ) {}

  async create (
    dto: CreateFileEntityDto,
    collectionName: string,
    entityUuid: string,
    entityType: string
  ): Promise<FileEntity> {
    const file = this.fileEntityRepository.create({
      ...dto,
      collectionName,
      entityUuid,
      entityType
    })
    return await this.fileEntityRepository.save(file)
  }

  async update (
    FileEntity: FileEntity,
    dto: CreateFileEntityDto
  ): Promise<FileEntity> {
    const updated = this.fileEntityRepository.merge(
      FileEntity,
      dto
    )
    return await this.fileEntityRepository.save(updated)
  }

  async sync<T extends ObjectLiteral> (
    dtos: CreateFileEntityDto[],
    collectionName: keyof T,
    entityUuid: string,
    entityType: string
  ): Promise<void> {
    const collectionNameString = collectionName.toString()
    const existingFileEntitys = await this.fileEntityRepository.find({
      where: {
        collectionName: collectionNameString,
        entityUuid,
        entityType
      }
    })

    // Remove FileEntitys that are no longer included
    const removeFileEntitys = existingFileEntitys.filter(
      (existing) => !dtos.some(
        (dto) => dto.fileUuid === existing.fileUuid
      )
    )
    for (const FileEntity of removeFileEntitys ?? []) {
      await this.fileEntityRepository.remove(FileEntity)
    }

    // Create or update included FileEntitys
    for (const dto of dtos) {
      const existingFileEntity = existingFileEntitys.find(
        (FileEntity) => FileEntity.fileUuid === dto.fileUuid
      )

      if (existingFileEntity == null) {
        await this.create(dto, collectionNameString, entityUuid, entityType)
      } else {
        await this.update(existingFileEntity, dto)
      }
    }
  }
}
