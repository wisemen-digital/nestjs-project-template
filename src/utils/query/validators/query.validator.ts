import { Injectable, type PipeTransform, type ArgumentMetadata } from '@nestjs/common'
import { type ClassConstructor, plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { CustomError } from '@appwise/express-dto-router'
import { type SearchQuery } from '../search-query.dto.js'
import { KnownError } from '../../Exceptions/errors.js'

@Injectable()
export class ParseQueryPipe<Query extends SearchQuery>
implements PipeTransform<string, Promise<Query>> {
  constructor (private readonly type: ClassConstructor<Query>) {}

  async transform (value: string, _metadata: ArgumentMetadata): Promise<Query> {
    const parsedQuery = this.parse(value)
    return await this.decodeAsOrFail(parsedQuery, this.type)
  }

  public async decodeAsOrFail
  (data: unknown, type: ClassConstructor<Query>): Promise<Query> {
    const object = plainToInstance(type, data)

    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      always: true,
      strictGroups: false
    })
    if (errors.length > 0) {
      throw new CustomError(errors)
    }

    return object
  }

  public parse (value: string): unknown {
    if (value == null) return {}
    try {
      return JSON.parse(Buffer.from(value.toString(), 'base64').toString())
    } catch {
      throw new KnownError('invalid_parameters').setDesc(`Could not decode search query: ${value}`)
    }
  }
}
