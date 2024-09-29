import axios from 'axios'
import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import { UserRepository } from '../repositories/user.repository.js'
import { User } from '../entities/user.entity.js'
import { RedisClient } from '../../redis/redis.client.js'
import { UserPersistService } from './user-persist.service.js'

export interface AuthContent {
  uuid: string
}

@Injectable()
export class UserAuthService {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly redisClient: RedisClient,
    private readonly userPersistService: UserPersistService,
    private readonly configService: ConfigService
  ) { }

  async findOneBySubject (subject: string): Promise<AuthContent> {
    const cacheKey = `auth:${subject}`

    const cachedUser = await this.redisClient.getCachedValue(cacheKey)

    if (cachedUser != null) {
      return JSON.parse(cachedUser) as AuthContent
    }

    let user = await this.userRepository.findOne({ where: { subject } })

    if (user == null) {
      user = await this.fetchAndCreateUser(subject)
    }

    const response = {
      uuid: user.uuid
    }

    await this.redisClient.putCachedValue(cacheKey, JSON.stringify(response))

    return user
  }

  private async fetchAndCreateUser (subject: string): Promise<User> {
    const res = await axios.get<{
      user: {
        userId: string
        username: string
        human: {
          profile: {
            givenName: string
            familyName: string
          }
          email: { email: string, isVerified: boolean }
        }
      }
    }>(`${this.configService.getOrThrow('AUTH_API_ENDPOINT')}/v2/users/${subject}`, {
      headers: {
        Authorization: `Bearer ${this.configService.getOrThrow('AUTH_API_KEY')}`
      }
    })

    return await this.userPersistService.create({
      subject,
      email: res.data.user.human.email.email,
      firstName: res.data.user.human.profile.givenName,
      lastName: res.data.user.human.profile.familyName
    })
  }
}
