import { Injectable } from '@nestjs/common'
import { InOrIgnore } from '../../../../utils/query/in-or-ignore.js'
import { UserRepository } from '../../../users/repositories/user.repository.js'
import {
  UserSearchTransformer,
  type UserSearchTransformerType
} from '../../transformers/user.transformer.js'
import { type User } from '../../../users/entities/user.entity.js'
import { type TypesenseCollector } from './typesense-collector.factory.js'

// eslint-disable-next-line unused-imports/no-unused-vars
@Injectable()
export class UserTypesenseCollector implements TypesenseCollector {
  constructor (
    private readonly userRepository: UserRepository
  ) {}

  transform (users: User[]): UserSearchTransformerType[] {
    return new UserSearchTransformer().array(users)
  }

  async fetch (uuids?: string[]): Promise<User[]> {
    return await this.userRepository.find({
      where: { uuid: InOrIgnore(uuids) },
      relations: { role: true }
    })
  }
}
