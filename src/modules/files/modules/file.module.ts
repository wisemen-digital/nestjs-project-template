import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from '../../users/modules/user.module.js'
import { S3Service } from '../services/s3.service.js'
import { FileEntityRepository } from '../repositories/file-entity.repository.js'
import { FileRepository } from '../repositories/file.repository.js'
import { FileEntity } from '../entities/file-entity.entity.js'
import { FileController } from '../controllers/file.controller.js'
import { FileEntityService } from '../services/file-entity.service.js'
import { FileService } from '../services/file.service.js'
import { FileSubscriber } from '../subscribers/file.subscriber.js'
import { File } from '../entities/file.entity.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([File, FileEntity]),
    UserModule,
    ConfigModule
    // PGBossModule.forJobs([
    //   RemoveUnusedMediaJob
    // ])
  ],
  controllers: [FileController],
  providers: [
    FileRepository,
    FileEntityRepository,
    FileService,
    FileEntityService,
    FileSubscriber,
    S3Service

    // RemoveUnusedMediaJobHandler,
    // RemoveUnusedMediaCron
  ],
  exports: [
    FileService,
    FileEntityService
  ]
})
export class FileModule {}
