import { type Readable } from 'stream'
import { DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, type ListObjectsV2Output, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Upload } from '@aws-sdk/lib-storage'
import { type MimeType } from '../enums/mime-type.enum.js'

@Injectable()
export class S3Service {
  private readonly s3: S3Client

  constructor (
    private readonly configService: ConfigService
  ) {
    const region = this.configService.get('S3_REGION', 'nl-ams')

    this.s3 = new S3Client({
      forcePathStyle: false,
      region,
      endpoint: 'https://' + this.configService.getOrThrow('S3_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.getOrThrow('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.getOrThrow('S3_SECRET_KEY')
      }
    })
  }

  public async createTemporaryDownloadUrl (
    name: string,
    fileUuid: string,
    mimeType?: MimeType,
    expiresInSeconds?: number
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: this.createKey(fileUuid),
      ResponseContentType: mimeType ?? 'application/octet-stream',
      ResponseContentDisposition: `attachment; filename=${name}`
    })

    return await getSignedUrl(this.s3, command, { expiresIn: expiresInSeconds ?? 1800 })
  }

  public async createTemporaryUploadUrl (
    fileUuid: string,
    mimeType: string,
    expiresIn?: number
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: this.createKey(fileUuid),
      ContentType: mimeType,
      ACL: 'private'
    })

    return await getSignedUrl(this.s3, command, { expiresIn: expiresIn ?? 180 })
  }

  public async upload (fileUuid: string, content: Buffer): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: this.createKey(fileUuid),
      Body: content,
      ACL: 'private'
    })

    await this.s3.send(command)
  }

  public async uploadStream (fileUuid: string, stream: Readable): Promise<void> {
    const parallelUploads = new Upload({
      client: this.s3,
      params: {
        Bucket: this.bucketName,
        Key: this.createKey(fileUuid),
        Body: stream,
        ACL: 'private'
      },
      queueSize: 10,
      leavePartsOnError: false
    })

    await parallelUploads.done()
  }

  public async list (fileUuid: string): Promise<ListObjectsV2Output['Contents']> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: this.createKey(fileUuid)
    })

    const result = await this.s3.send(command)

    return result.Contents
  }

  public async delete (fileUuid: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: this.createKey(fileUuid)
    })

    await this.s3.send(command)
  }

  private get bucketName (): string {
    return this.configService.getOrThrow('S3_BUCKET')
  }

  private createKey (fileUuid: string): string {
    const env = this.configService.get('NODE_ENV', 'local')

    return `${env}/${fileUuid}`
  }
}
