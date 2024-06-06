import { type DynamicModule, Module } from '@nestjs/common'
import { type QueueName } from '../pgboss/types/queue-name.enum.js'
import { WorkerService } from './services/worker.service.js'
import { PgBossModule } from '../pgboss/modules/pgboss.module.js'

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
