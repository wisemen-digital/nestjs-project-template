import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, OneToMany, type Relation } from 'typeorm'
import { Permission } from '../../permissions/permission.enum.js'
import { User } from '../../users/entities/user.entity.js'

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @CreateDateColumn({ precision: 3 })
  createdAt: Date

  @UpdateDateColumn({ precision: 3 })
  updatedAt: Date

  @Column({ type: 'varchar', unique: true })
  name: string

  @Column({ type: 'varchar', enum: Permission, default: [], array: true })
  permissions: Array<Relation<Permission>>

  @OneToMany(() => User, user => user.role)
  users?: Array<Relation<User>>
}
