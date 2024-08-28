import { Injectable } from '@nestjs/common'
import type { File } from '../entities/file.entity.js'
import { FileRepository } from '../repositories/file.repository.js'
import type { CreateFileDto } from '../dtos/create-file.dto.js'

@Injectable()
export class FileService {
  constructor (
    private readonly fileRepository: FileRepository
  ) {}

  async findOneOrFailOnUuid (uuid: string): Promise<File> {
    return await this.fileRepository.findOneByOrFail({ uuid })
  }

  async create (
    dto: CreateFileDto,
    userUuid?: string
  ): Promise<File> {
    const file = this.fileRepository.create({
      ...dto,
      userUuid
    })

    await this.fileRepository.insert(file)

    return file
  }

  async confirmUploadOrFail (uuid: string): Promise<void> {
    const file = await this.fileRepository.findOneByOrFail({ uuid })

    await this.fileRepository.update(
      { uuid: file.uuid },
      { isUploadConfirmed: true }
    )
  }

  async remove (uuid: string): Promise<void> {
    const file = await this.fileRepository.findOneByOrFail({ uuid })

    await this.fileRepository.remove(file)
  }
}
