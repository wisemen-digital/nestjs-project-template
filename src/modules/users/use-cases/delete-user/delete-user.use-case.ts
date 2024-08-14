import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../repositories/user.repository.js'
import {
  TypesenseCollectionName
} from '../../../typesense/enums/typesense-collection-index.enum.js'
import {
  TypesenseCollectionService
} from '../../../typesense/services/typesense-collection.service.js'

@Injectable()
export class DeleteUserUseCase {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly typesenseService: TypesenseCollectionService
  ) {}

  async delete (userUuid: string): Promise<void> {
    const user = await this.userRepository.findOneByOrFail({ uuid: userUuid })
    await this.typesenseService.deleteFromTypesense(TypesenseCollectionName.USER, userUuid)
    await this.userRepository.softDelete({ uuid: userUuid })
  }
}
