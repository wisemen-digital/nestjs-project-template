import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne, DeleteDateColumn
} from 'typeorm'
import { Role } from '../../roles/entities/role.entity.js'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @Column({ type: 'varchar', unique: true })
  sub: string

  @CreateDateColumn({ precision: 3 })
  createdAt: Date

  @UpdateDateColumn({ precision: 3 })
  updatedAt: Date

  @DeleteDateColumn({ precision: 3 })
  deletedAt: Date

  @Column({ type: 'varchar', unique: true })
  @Index({ unique: true })
  email: string

  @Column({ type: 'varchar', nullable: true })
  firstName: string | null

  @Column({ type: 'varchar', nullable: true })
  lastName: string | null

  @Index()
  @Column({ type: 'uuid', nullable: true })
  roleUuid: string | null

  @ManyToOne(() => Role, role => role.users, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'roleUuid' })
  role?: Relation<Role> | null
}
