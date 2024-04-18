import { Injectable } from '@nestjs/common'
import { randFirstName, randLastName, randPassword } from '@ngneat/falso'
import bcrypt from 'bcryptjs'
import { type DeepPartial } from 'typeorm'
import { type SeederOptions } from '../../../../test/utils/seeder-options.js'
import { type User } from '../entities/user.entity.js'
import { type Client } from '../../auth/entities/client.entity.js'
import { TokenService } from '../../auth/services/token.service.js'
import { ClientSeeder } from '../../auth/tests/client.seeder.js'
import { UserRepository } from '../repositories/user.repository.js'
import { type CreateUserDto } from '../dtos/create-user.dto.js'

export interface UserSeederOptions extends SeederOptions {
  password?: string | null
  roleUuid?: string | null
  companyName?: string | null
  email: string
}

@Injectable()
export class UserSeeder {
  constructor (
    private readonly tokenService: TokenService,
    private readonly clientSeeder: ClientSeeder,
    private readonly userRepository: UserRepository
  ) {}

  async setupUser (options: UserSeederOptions): Promise<{
    user: User
    client: Client
    token: string
  }> {
    const client = await this.clientSeeder.getTestClient()

    const user = await this.createRandomUser(options)

    const token = await this.tokenService.generateAccessToken(client, user, ['read', 'write'])

    return { user, client, token }
  }

  async createRandomUser (options: UserSeederOptions): Promise<User> {
    const password = randPassword()

    const user = this.userRepository.create({
      email: options?.email,
      password: await bcrypt.hash(password, 10),
      firstName: randFirstName(),
      lastName: randLastName(),
      roleUuid: options?.roleUuid ?? null
    })

    await this.userRepository.save(user)

    return user
  }

  async createRandomUserDto (options: UserSeederOptions): Promise<DeepPartial<CreateUserDto>> {
    const password = randPassword()

    const userDto: DeepPartial<CreateUserDto> = {
      email: options?.email,
      password: await bcrypt.hash(password, 10),
      firstName: randFirstName(),
      lastName: randLastName()
    }

    return userDto
  }
}
