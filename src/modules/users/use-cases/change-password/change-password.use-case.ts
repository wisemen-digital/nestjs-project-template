import { Injectable } from '@nestjs/common'
import { type UserUuid } from '../../user-uuid.js'
import { UserRepository } from '../../repositories/user.repository.js'
import { type User } from '../../entities/user.entity.js'
import { createHash } from '../../../../common/hash/create-hash.js'
import { verifyPassword } from '../../../../common/auth/verify-password.js'
import { KnownError } from '../../../../common/exceptions/errors.js'
import { type ChangePasswordRequest } from './change-password.request.js'
import { InvalidOldPasswordError } from './invalid-old-password.error.js'

@Injectable()
export class ChangePasswordUseCase {
  constructor (
    private readonly userRepository: UserRepository
  ) {}

  async changePassword (
    forUserUuid: UserUuid,
    changePasswordRequest: ChangePasswordRequest
  ): Promise<User> {
    const user = await this.userRepository.findByUuidOrFail(forUserUuid)
    await this.verifyPassword(user.password, changePasswordRequest.oldPassword)
    const newPassword = await createHash(changePasswordRequest.newPassword)
    await this.userRepository.update({ uuid: forUserUuid.toString() }, { password: newPassword })
    return user
  }

  private async verifyPassword (oldPassword: string, newPassword: string): Promise<void> {
    try {
      await verifyPassword(newPassword, oldPassword)
    } catch (error) {
      if (error instanceof KnownError) {
        throw new InvalidOldPasswordError()
      } else {
        throw error
      }
    }
  }
}
