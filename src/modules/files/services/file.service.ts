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
    const file = this.fileRepository.create({
      ...dto,
      userUuid
    })

    await this.fileRepository.insert(file)

    const uploadUrl = await this.s3Service.createTemporaryUploadUrl(
      file.uuid,
      dto.mimeType
    )

    return {
      file,
      uploadUrl
    }
  }

  async getTemporaryUrl (file: File): Promise<string> {
    const url = await this.s3Service.createTemporaryDownloadUrl(
      file.name,
      file.uuid,
      file.mimeType ?? undefined
    )

    return url
  }

  async confirmUploadOrFail (uuid: string): Promise<void> {
    const file = await this.findOneOrFail({ uuid })

    await this.fileRepository.update({
      uuid: file.uuid
    }, {
      isUploadConfirmed: true
    })
  }

  async remove (fileUuid: string): Promise<void> {
    const file = await this.findOneOrFail({ uuid: fileUuid })

    await this.fileRepository.remove(file)

    await this.s3Service.delete(file.uuid)
  }
}
