import { Injectable } from '@nestjs/common'
import type { User } from '../../entities/user.entity.js'
import { UserRepository } from '../../repositories/user.repository.js'

@Injectable()
export class ViewUserUseCase {
  constructor (
    private readonly userRepository: UserRepository
  ) {}

  async viewUser (userUuid: string): Promise<User> {
    return await this.userRepository.findOneByOrFail({ uuid: userUuid })
  }
}
