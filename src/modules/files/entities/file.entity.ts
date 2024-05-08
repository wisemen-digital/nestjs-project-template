import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Column, OneToMany, type Relation } from 'typeorm'
import { FileEntity } from './file-entity.entity.js'

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @CreateDateColumn({ precision: 3 })
  createdAt: Date

  @UpdateDateColumn({ precision: 3 })
  updatedAt: Date

  @DeleteDateColumn({ precision: 3, nullable: true })
  deletedAt: Date | null

  @Column({ type: 'varchar' })
  fileName: string

  @Column({ type: 'varchar', nullable: true })
  mimeType: string | null

  @Column({ type: 'uuid', nullable: true })
  userUuid: string | null

  @Column({ type: 'boolean', default: false })
  isUploadConfirmed: boolean

  @OneToMany(() => FileEntity, fileEntity => fileEntity.file)
  fileEntities?: Array<Relation<FileEntity>>

  url: string
}
