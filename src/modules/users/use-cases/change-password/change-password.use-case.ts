import { Injectable } from '@nestjs/common'
import { DuckUuid, UserUuid } from '../../user-uuid.js'
import { type ChangePasswordRequest } from './change-password.request.js'

@Injectable()
export class ChangePasswordUseCase {
  async changePassword (
    forUserUuid: UserUuid,
    changePasswordRequest: ChangePasswordRequest
  ): Promise<void> {
    const duckUuid = new DuckUuid('lsdfjkl')
    const userUuid = new UserUuid('sldfkj')

    userUuid.equals(duckUuid)

    function foo (duckUuid: DuckUuid) {}
    foo(userUuid)

    // const user = await this.findOneOrFail(userUuid)
    // await validatePassword(dto.oldPassword, user.password)
    //
    // await this.userRepository.update(user.uuid, { password: await createHash(dto.password) })
    // return user
  }
}
