import { Injectable } from '@nestjs/common'
import type { User } from '../../entities/user.entity.js'
import { UserRepository } from '../../repositories/user.repository.js'
import { UserTypesenseRepository } from '../../repositories/user-typesense.repository.js'
import { UserUuid } from '../../user-uuid.js'
import { createHash } from '../../../../common/hash/create-hash.js'
import type { RegisterUserRequest } from './register-user.request.js'
import { EmailAlreadyInUseError } from './email-already-in-use-error.js'

@Injectable()
export class RegisterUserUseCase {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly userTypesenseRepository: UserTypesenseRepository
  ) {}

  async create (dto: RegisterUserRequest): Promise<User> {
    this.sanitizeDto(dto)

    if (await this.emailAlreadyUsed(dto.email)) {
      throw new EmailAlreadyInUseError(dto.email)
    }

    const user = await this.mapDtoToUser(dto)
    await this.persistUser(user)
    return user
  }

  private sanitizeDto (dto: RegisterUserRequest): void {
    dto.email = dto.email.toLowerCase()
  }

  private async emailAlreadyUsed (email: string): Promise<boolean> {
    return await this.userRepository.exist({ where: { email } })
  }

  private async mapDtoToUser (dto: RegisterUserRequest): Promise<User> {
    return this.userRepository.create({
      uuid: new UserUuid(),
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      password: await createHash(dto.password)
    })
  }

  private async persistUser (user: User): Promise<void> {
    await this.userTypesenseRepository.insert(user)
    await this.userRepository.insert(user)
  }
}
