import { type DynamicModule, Module } from '@nestjs/common'
import { type QueueName } from '../pgboss/types/queue-name.enum.js'
import { PgBossModule } from '../pgboss/pgboss.module.js'
import { WorkerService } from './services/worker.service.js'

@Module({})
export class PgBossWorkerModule {
  static register (queue: QueueName): DynamicModule {
    return {
      module: PgBossWorkerModule,
      imports: [
        PgBossModule.forRoot()
      ],
      providers: [
        {
          provide: 'QUEUE_NAME',
          useValue: queue
        },
        WorkerService
      ]
    }
  }
}
