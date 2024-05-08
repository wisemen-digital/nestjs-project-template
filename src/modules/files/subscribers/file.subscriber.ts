import { type EntitySubscriberInterface, DataSource, type RemoveEvent } from 'typeorm'
import { InjectDataSource } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { File } from '../entities/file.entity.js'
import { FileService } from '../services/file.service.js'
import { S3Service } from '../services/s3.service.js'

@Injectable()
export class FileSubscriber implements EntitySubscriberInterface<File> {
  constructor (
    @InjectDataSource() readonly dataSource: DataSource,
    private readonly fileService: FileService,
    private readonly s3Service: S3Service
  ) {
    dataSource.subscribers.push(this)
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  listenTo (): string | Function {
    return File
  }

  async afterLoad (media: File): Promise<void> {
    media.url = await this.fileService.getTemporarilyUrl(media)
  }

  async afterRemove (event: RemoveEvent<File>): Promise<void> {
    await this.s3Service.delete(event.entityId)
  }
}
