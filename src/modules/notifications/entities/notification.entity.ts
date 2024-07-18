import { Entity, Column, Index, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Relation, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../../users/entities/user.entity.js'

@Index(['userUuid', 'deviceUuid'], { unique: true })
@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @Column({ type: 'uuid' })
  userUuid: string

  @ManyToOne(() => User, user => user.notifications)
  @JoinColumn({ name: 'userUuid' })
  user?: Relation<User>

  @Column({ type: 'uuid' })
  deviceUuid: string

  @CreateDateColumn({ precision: 3 })
  createdAt: Date

  @UpdateDateColumn({ precision: 3 })
  updatedAt: Date

  @Column({ type: 'int', default: 2147483647 })
  config: number
}
