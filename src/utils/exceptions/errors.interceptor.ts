import {
  Injectable,
  type NestInterceptor,
  type ExecutionContext,
  type CallHandler,
  HttpException
} from '@nestjs/common'
import { type Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { EntityNotFoundError } from 'typeorm'

// TODO: Add conversion to JSON API error format

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept (context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next
      .handle()
      .pipe(
        catchError(err => {
          if (err instanceof EntityNotFoundError) {
            throw new HttpException('not_found', 404)
          }
          throw err
        }
        )
      )
  }
}
