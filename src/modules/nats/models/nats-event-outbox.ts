import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

export enum NatsEventOutboxState {
  PENDING = 'pending',
  SENDING = 'sending',
  SENT = 'sent'
}

@Entity()
@Index(['state', 'createdAt'], { where: `"state" = '${NatsEventOutboxState.PENDING}'` })
export class NatsEventOutbox {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @CreateDateColumn({ precision: 3 })
  createdAt: Date

  @Column({ enum: NatsEventOutboxState, default: NatsEventOutboxState.PENDING })
  state: NatsEventOutboxState

  @Column({ type: 'timestamp', precision: 3, nullable: true })
  sentAt: Date | null

  @Column({ type: 'varchar' })
  topic: string

  @Column({ type: 'varchar' })
  serializedMessage: string
}
