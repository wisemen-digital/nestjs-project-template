import { Injectable } from '@nestjs/common'
import { type UserUuid } from '../../user-uuid.js'
import { type User } from '../../entities/user.entity.js'
import { UserRepository } from '../../repositories/user.repository.js'

@Injectable()
export class ViewUserUseCase {
  constructor (
    private readonly userRepository: UserRepository
  ) {}

  async viewUser (userUuid: UserUuid): Promise<User> {
    return await this.userRepository.findOneByOrFail({ uuid: userUuid.toString() })
  }
}
