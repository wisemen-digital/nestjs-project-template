import { type DynamicModule, Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { EventEmitter } from './event-emitter.js'

@Module({})
export class EventModule {
  static forRoot (
    modules: DynamicModule[] = []
  ): DynamicModule {
    return {
      module: EventModule,
      imports: [
        EventEmitterModule.forRoot({
          wildcard: true,
          ignoreErrors: false
        }),
        ...modules
      ],
      providers: [EventEmitter],
      exports: [EventEmitter]
    }
  }
}
