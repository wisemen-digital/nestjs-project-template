import { Injectable } from '@nestjs/common'
import type { File } from '../entities/file.entity.js'
import type { CreateFileDto } from '../dtos/create-file.dto.js'
import { S3Service } from './s3.service.js'
import { FileService } from './file.service.js'

@Injectable()
export class FileFlowService {
  constructor (
    private readonly fileService: FileService,
    private readonly s3Service: S3Service
  ) {}

  async findOneOrFail (uuid: string): Promise<File> {
    return await this.fileService.findOneOrFailOnUuid(uuid)
  }

  async create (
    dto: CreateFileDto,
    userUuid: string
  ): Promise<{ file: File, uploadUrl: string }> {
    const file = await this.fileService.create(dto, userUuid)
    const uploadUrl = await this.s3Service.createTemporaryUploadUrl(file)

    return { file, uploadUrl }
  }

  async getTemporaryUrl (
    uuid: string
  ): Promise<{ file: File, temporaryUrl: string }> {
    const file = await this.fileService.findOneOrFailOnUuid(uuid)
    const temporaryUrl = await this.s3Service.createTemporaryDownloadUrl(
      file.name,
      file.uuid,
      file.mimeType
    )

    return { file, temporaryUrl }
  }

  async confirmUploadOrFail (uuid: string): Promise<void> {
    await this.fileService.confirmUploadOrFail(uuid)
  }

  async remove (fileUuid: string): Promise<void> {
    await this.fileService.remove(fileUuid)
    await this.s3Service.delete(fileUuid)
  }
}
