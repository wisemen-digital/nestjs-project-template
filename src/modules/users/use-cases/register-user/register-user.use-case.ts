import { Injectable } from '@nestjs/common'
import type { User } from '../../entities/user.entity.js'
import { UserRepository } from '../../repositories/user.repository.js'

import { UserPersistService } from '../../services/user-persist.service.js'
import type { RegisterUserCommand } from './register-user.command.js'
import { EmailAlreadyInUseError } from './email-already-in-use.error.js'

@Injectable()
export class RegisterUserUseCase {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly userPersistService: UserPersistService
  ) {}

  async register (dto: RegisterUserCommand): Promise<User> {
    this.sanitizeDto(dto)

    if (await this.emailAlreadyUsed(dto.email)) {
      throw new EmailAlreadyInUseError(dto.email)
    }

    const user = await this.userPersistService.create({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName
    })

    return user
  }

  private sanitizeDto (dto: RegisterUserCommand): void {
    dto.email = dto.email.toLowerCase()
  }

  private async emailAlreadyUsed (email: string): Promise<boolean> {
    return await this.userRepository.exist({ where: { email } })
  }
}
