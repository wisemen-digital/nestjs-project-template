import { type DynamicModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import configuration from '../../../config/env/configuration.js'
import { sslHelper } from '../../../config/sql/utils/typeorm.js'
import { mainMigrations } from '../../../config/sql/migrations/index.js'
import { NatsClient } from '../nats.client.js'
import { NatsOutboxRepository } from './nats-outbox.repository.js'
import { NatsOutboxPublisher } from './nats-outbox-publisher.js'
import { NatsOutboxEvent } from './nats-outbox-event.js'

@Module({})
export class NatsOutboxModule {
  static forRoot (): DynamicModule {
    return {
      module: NatsOutboxModule,
      imports: [
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({
          envFilePath: process.env.ENV_FILE,
          load: [configuration],
          isGlobal: true
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: process.env.DATABASE_URI,
          ssl: sslHelper(process.env.DATABASE_SSL),
          extra: { max: 50 },
          logging: false,
          synchronize: false,
          migrations: mainMigrations,
          migrationsRun: true,
          autoLoadEntities: true
        }),
        TypeOrmModule.forFeature([NatsOutboxEvent])
      ],
      providers: [
        NatsClient,
        NatsOutboxRepository,
        NatsOutboxPublisher
      ]
    }
  }
}
