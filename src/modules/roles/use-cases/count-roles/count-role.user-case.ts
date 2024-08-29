import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../../users/repositories/user.repository.js'

@Injectable()
export class CountRoleUseCase {
  constructor (
    private readonly userRepository: UserRepository
  ) {}

  async countRole (uuid: string): Promise<number> {
    return await this.userRepository.count({
      where: { roleUuid: uuid }
    })
  }
}
