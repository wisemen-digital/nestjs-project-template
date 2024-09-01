import { Injectable } from '@nestjs/common'
import { DeepPartial } from 'typeorm'
import type { User } from '../entities/user.entity.js'
import { UserRepository } from '../repositories/user.repository.js'
import { TypesenseCollectionName } from '../../typesense/enums/typesense-collection-index.enum.js'
import { TypesenseCollectionService } from '../../typesense/services/typesense-collection.service.js'

@Injectable()
export class UserPersistService {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly typesenseService: TypesenseCollectionService
  ) {}

  async create (userData: DeepPartial<User>): Promise<User> {
    const user = this.userRepository.create(userData)

    await this.userRepository.insert(user)
    await this.typesenseService.importManuallyToTypesense(TypesenseCollectionName.USER, [user])

    return user
  }
}
