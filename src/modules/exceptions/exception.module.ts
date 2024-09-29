import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { CustomExceptionFilter } from './exception.filter.js'

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter
    }
  ]
})
export class ExceptionModule {}
