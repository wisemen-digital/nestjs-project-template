import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne
} from 'typeorm'
import { Client } from '../../auth/entities/client.entity.js'
import { RefreshToken } from '../../auth/entities/refreshtoken.entity.js'
import { Role } from '../../roles/entities/role.entity.js'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @CreateDateColumn({ precision: 3 })
  createdAt: Date

  @UpdateDateColumn({ precision: 3 })
  updatedAt: Date

  @Column({ type: 'varchar', unique: true })
  @Index({ unique: true })
  email: string

  @Column({ type: 'varchar' })
  password: string

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

  @OneToMany(() => Client, client => client.user)
  clients?: Array<Relation<Client>>

  @OneToMany(() => RefreshToken, token => token.user)
  tokens?: Array<Relation<RefreshToken>>
}
