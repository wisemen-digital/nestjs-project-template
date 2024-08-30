import { type ExceptionFilter, Catch, type ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { CustomError } from '@appwise/express-dto-router'
import { captureException } from '@sentry/node'
import { EntityNotFoundError } from 'typeorm'
import { KnownError } from './errors.js'
import { ApiError } from './api-errors/api-error.js'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor (private readonly httpAdapterHost: HttpAdapterHost) {}

  catch (exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const { status, response } = this.getResponse(exception)

    this.httpAdapterHost.httpAdapter.reply(ctx.getResponse(), response, status)
  }

  private getResponse (exception: Error): { status: number, response: unknown } {
    if (exception instanceof EntityNotFoundError) {
      exception = new KnownError('not_found')
    }

    if (exception instanceof CustomError) {
      return { status: exception.status ?? 400, response: exception.response }
    } else if (exception instanceof ApiError) {
      return {
        status: Number(exception.status),
        response: {
          errors: [{
            code: exception.code,
            detail: exception.detail,
            status: exception.status,
            meta: exception.meta
          }]
        }
      }
    } else if (exception instanceof HttpException) {
      return {
        status: exception.getStatus() ?? HttpStatus.INTERNAL_SERVER_ERROR,
        response: exception.getResponse()
      }
    } else {
      const id = captureException(exception)

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        response: {
          id,
          code: exception?.name,
          detail: exception?.message
        }
      }
    }
  }
}
