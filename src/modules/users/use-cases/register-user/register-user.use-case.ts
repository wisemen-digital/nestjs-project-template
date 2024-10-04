import { randomUUID } from 'crypto'
import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import type { User } from '../../entities/user.entity.js'
import { UserRepository } from '../../repositories/user.repository.js'
import { createHash } from '../../../../utils/helpers/hash.helper.js'
import {
  TypesenseCollectionName
} from '../../../typesense/enums/typesense-collection-index.enum.js'
import {
  TypesenseCollectionService
} from '../../../typesense/services/typesense-collection.service.js'
import { EventEmitter } from '../../../events/event-emitter.js'
import { transaction } from '../../../typeorm/utils/transaction.js'
import type { RegisterUserCommand } from './register-user.command.js'
import { EmailAlreadyInUseError } from './email-already-in-use.error.js'
import { UserRegisteredEvent } from './user-registered.event.js'

@Injectable()
export class RegisterUserUseCase {
  constructor (
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter,
    private readonly userRepository: UserRepository,
    private readonly typesenseService: TypesenseCollectionService
  ) {}

  async register (dto: RegisterUserCommand): Promise<User> {
    this.sanitizeDto(dto)

    if (await this.emailAlreadyUsed(dto.email)) {
      throw new EmailAlreadyInUseError(dto.email)
    }

    const user = await this.mapDtoToUser(dto)

    await transaction(this.dataSource, async () => {
      await this.persistUser(user)

      const event = new UserRegisteredEvent(user)

      await this.eventEmitter.emit(event)
    })

    return user
  }

  private sanitizeDto (dto: RegisterUserCommand): void {
    dto.email = dto.email.toLowerCase()
  }

  private async emailAlreadyUsed (email: string): Promise<boolean> {
    return await this.userRepository.exist({ where: { email } })
  }

  private async mapDtoToUser (dto: RegisterUserCommand): Promise<User> {
    return this.userRepository.create({
      uuid: randomUUID(),
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      password: await createHash(dto.password)
    })
  }

  private async persistUser (user: User): Promise<void> {
    await this.typesenseService.importManuallyToTypesense(TypesenseCollectionName.USER, [user])
    await this.userRepository.insert(user)
  }
}
