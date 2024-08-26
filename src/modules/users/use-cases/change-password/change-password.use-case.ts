import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../repositories/user.repository.js'
import { type User } from '../../entities/user.entity.js'
import { createHash, verifyPassword } from '../../../../utils/helpers/hash.helper.js'
import { type ChangePasswordCommand } from './change-password.command.js'

@Injectable()
export class ChangePasswordUseCase {
  constructor (
    private readonly userRepository: UserRepository
  ) {}

  async changePassword (
    forUserUuid: string,
    changePasswordRequest: ChangePasswordCommand
  ): Promise<User> {
    const user = await this.userRepository.findOneByOrFail({ uuid: forUserUuid })
    await verifyPassword(changePasswordRequest.oldPassword, user.password)
    const newPassword = await createHash(changePasswordRequest.newPassword)
    await this.userRepository.update({ uuid: forUserUuid.toString() }, { password: newPassword })
    return user
  }
}
