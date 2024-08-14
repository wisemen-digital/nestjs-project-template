import { Injectable } from '@nestjs/common'

import { TypesenseCollectionService } from '../../typesense/services/typesense-collection.service.js'
import { TypesenseCollectionName } from '../../typesense/enums/typesense-collection-index.enum.js'
import { CacheService } from '../../cache/cache.service.js'
import { UserService } from './user.service.js'

@Injectable()
export class UserFlowService {
  constructor (
    private readonly userService: UserService,
    private readonly typesenseService: TypesenseCollectionService,
    private readonly cacheService: CacheService
  ) {}

  async delete (userUuid: string): Promise<void> {
    await this.userService.delete(userUuid)
    await this.typesenseService.deleteFromTypesense(TypesenseCollectionName.USER, userUuid)
  }
}
