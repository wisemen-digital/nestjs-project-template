import {
  Injectable,
  type NestInterceptor,
  type ExecutionContext,
  type CallHandler
} from '@nestjs/common'
import type { Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { EntityNotFoundError } from 'typeorm'
import { NotFoundError } from './generic/not-found.error.js'

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept (_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next
      .handle()
      .pipe(
        catchError((err) => {
          if (err instanceof EntityNotFoundError) {
            throw new NotFoundError()
          }

          throw err
        })
      )
  }
}
