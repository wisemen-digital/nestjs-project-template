import { Injectable } from '@nestjs/common'
import { type User } from '@sentry/types'
import { isArray } from 'class-validator'
import { TypesenseQueryService } from '../../typesense/services/typesense-query.service.js'
import { TypesenseCollectionName } from '../../typesense/enums/typesense-collection-index.enum.js'
import {
  TypesenseCollectionService
} from '../../typesense/services/typesense-collection.service.js'

@Injectable()
export class UserTypesenseRepository {
  constructor (
    private readonly typesenseQueryService: TypesenseQueryService,
    private readonly typesenseCollectionService: TypesenseCollectionService
  ) {}

  async insert (user: User): Promise<void>
  async insert (users: User[]): Promise<void>
  async insert (users: User | User[]): Promise<void> {
    if (!isArray(users)) {
      users = [users]
    }

    await this.typesenseCollectionService.importManually(
      TypesenseCollectionName.USER,
      users as User[]
    )
  }
}
