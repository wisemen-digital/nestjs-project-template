import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../repositories/user.repository.js'
import { type User } from '../../entities/user.entity.js'
import { createHash, validatePassword } from '../../../../utils/helpers/hash.helper.js'
import { type ChangePasswordCommand } from './change-password.command.js'
import { InvalidOldPasswordError } from './invalid-old-password.error.js'

@Injectable()
export class ChangePasswordUseCase {
  constructor (
    private readonly userRepository: UserRepository
  ) {}

  async changePassword (
    forUserUuid: string,
    changePasswordCommand: ChangePasswordCommand
  ): Promise<User> {
    const user = await this.userRepository.findOneByOrFail({ uuid: forUserUuid })
    await this.verifyPassword(changePasswordCommand.oldPassword, user)
    const newPassword = await createHash(changePasswordCommand.newPassword)
    await this.userRepository.update({ uuid: forUserUuid.toString() }, { password: newPassword })
    return user
  }

  private async verifyPassword (oldPassword: string, user: User): Promise<void> {
    try {
      await validatePassword(oldPassword, user.password)
    } catch (e) {
      throw new InvalidOldPasswordError()
    }
  }
}
