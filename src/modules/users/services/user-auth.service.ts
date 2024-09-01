import axios from 'axios'
import { UserRepository } from '../repositories/user.repository.js'
import { User } from '../entities/user.entity.js'
import { RedisClient } from '../../redis/redis.client.js'
import { UserPersistService } from './user-persist.service.js'

export interface AuthContent {
  uuid: string
}

export class UserAuthService {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly redisClient: RedisClient,
    private readonly userPersistService: UserPersistService
  ) { }

  async findOneBySub (sub: string): Promise<AuthContent> {
    const cacheKey = `auth:${sub}`

    const cachedUser = await this.redisClient.getCachedValue(cacheKey)

    if (cachedUser != null) {
      return JSON.parse(cachedUser) as AuthContent
    }

    let user = await this.userRepository.findOne({ where: { sub } })

    if (user == null) {
      user = await this.fetchAndCreateUser(sub)
    }

    const response = {
      uuid: user.uuid
    }

    await this.redisClient.putCachedValue(cacheKey, JSON.stringify(response))

    return user
  }

  private async fetchAndCreateUser (sub: string): Promise<User> {
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
    }>(`http://localhost:8080/v2/users/${sub}`, {
      headers: {
        Authorization: `Bearer 73hctW-eoKlKZNvgyMjy_kBKIZhDbh-lUfSLlMuXBcxlYCCo9tKlBCsz-EXDmo77o5yQmPY`
      }
    })

    return await this.userPersistService.create({
      sub,
      email: res.data.user.human.email.email,
      firstName: res.data.user.human.profile.givenName,
      lastName: res.data.user.human.profile.familyName
    })
  }
}
