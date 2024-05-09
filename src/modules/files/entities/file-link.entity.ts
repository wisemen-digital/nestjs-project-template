import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from 'typeorm'
import { File } from './file.entity.js'

@Entity()
@Index(['entityType', 'entityUuid'])
export class FileLink {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @CreateDateColumn({ precision: 3 })
  createdAt: Date

  @UpdateDateColumn({ precision: 3 })
  updatedAt: Date

  @Index()
  @Column({ type: 'uuid' })
  fileUuid: string

  @ManyToOne(() => File, file => file.fileEntities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fileUuid' })
  file?: Relation<File>

  @Column({ type: 'varchar' })
  entityType: string

  @Index()
  @Column({ type: 'uuid' })
  entityUuid: string

  @Index()
  @Column({ type: 'varchar' })
  collectionName: string

  @Column({ type: 'smallint', nullable: true })
  order: number | null
}
