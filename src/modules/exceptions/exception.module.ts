import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { CustomerExceptionFilter } from './exception.filter.js'

@Module({
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ErrorInterceptor
    // },
    {
      provide: APP_FILTER,
      useClass: CustomerExceptionFilter
    }
  ]
})
export class ExceptionModule {}
