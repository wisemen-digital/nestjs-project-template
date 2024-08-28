import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Column, OneToMany, type Relation } from 'typeorm'
import type { MimeType } from '../enums/mime-type.enum.js'
import { FileLink } from './file-link.entity.js'

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @CreateDateColumn({ precision: 3 })
  createdAt: Date

  @UpdateDateColumn({ precision: 3 })
  updatedAt: Date

  @DeleteDateColumn({ precision: 3 })
  deletedAt: Date | null

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar', nullable: true })
  mimeType: MimeType | null

  @Column({ type: 'uuid', nullable: true })
  userUuid: string | null

  @Column({ type: 'boolean', default: false })
  isUploadConfirmed: boolean

  @OneToMany(() => FileLink, fileLink => fileLink.file)
  fileEntities?: Array<Relation<FileLink>>

  url: string
}
