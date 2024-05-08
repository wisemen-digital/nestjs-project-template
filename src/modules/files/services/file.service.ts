import { Injectable } from '@nestjs/common'
import { type FindOptionsWhere } from 'typeorm'
import { type File } from '../entities/file.entity.js'
import { FileRepository } from '../repositories/file.repository.js'
import { type CreateFileDto } from '../dtos/create-file.dto.js'
import { S3Service } from './s3.service.js'

@Injectable()
export class FileService {
  constructor (
    private readonly fileRepository: FileRepository,
    private readonly s3Service: S3Service
  ) {}

  async findOneOrFail (criteria: FindOptionsWhere<File>): Promise<File> {
    return await this.fileRepository.findOneOrFail({
      where: criteria
    })
  }

  async create (
    dto: CreateFileDto,
    userUuid?: string
  ): Promise<{ file: File, uploadUrl: string }> {
    let file = this.fileRepository.create({
      ...dto,
      userUuid
    })

    file = await this.fileRepository.save(file)

    const uploadUrl = await this.s3Service.getTemporarilyUploadUrl(
      file.uuid,
      dto.mimeType
    )

    return {
      file,
      uploadUrl
    }
  }

  async getTemporarilyUrl (file: File): Promise<string> {
    const url = await this.s3Service.getTemporarilyDownloadUrl(
      file.fileName,
      file.uuid,
      file.mimeType ?? undefined
    )

    return url
  }

  async confirmUploadOrFail (uuid: string): Promise<void> {
    const file = await this.findOneOrFail({ uuid })

    file.isUploadConfirmed = true
    await this.fileRepository.save(file)
  }

  async remove (file: File): Promise<void> {
    await this.fileRepository.remove(file)
  }
}
