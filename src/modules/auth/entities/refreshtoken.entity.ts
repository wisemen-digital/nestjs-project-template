import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from 'typeorm'
import { User } from '../../users/entities/user.entity.js'
import { Client } from './client.entity.js'

export interface RefreshTokenInterface {
  tid: string
  uid: string
  cid: string
  user: User
  client: {
    uuid: string
    id: string
    grants: string[]
    scopes: string[]
  }
  refreshToken: string
  refreshTokenExpiresAt: Date
}

export interface RefreshTokenPayload {
  tid: string
  uid: string
  cid: string
  scope: string[]
  exp: number
}

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @CreateDateColumn({ precision: 3 })
  createdAt: Date

  @DeleteDateColumn({ precision: 3 })
  deletedAt?: Date

  @Column({ type: 'timestamp', precision: 3 })
  expiresAt: Date

  @Column({ type: 'uuid' })
  userUuid: string

  @Column({ type: 'uuid' })
  clientUuid: string

  @Column('varchar', { array: true })
  scope: string[]

  @ManyToOne(() => User, user => user.tokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userUuid' })
  user: Relation<User>

  @ManyToOne(() => Client, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clientUuid' })
  client: Relation<Client>
}
