import { Injectable } from '@nestjs/common'
import { OAuth2Server, createOAuth2 } from '@appwise/oauth2-server'
import { type Response } from 'express'
import { UserService } from '../../users/services/user.service.js'
import { type AccessTokenInterface } from '../entities/accesstoken.entity.js'
import { type Request } from '../guards/auth.guard.js'
import { UserRepository } from '../../users/repositories/user.repository.js'
import { type User } from '../../users/entities/user.entity.js'
import { ClientService, scopes } from './client.service.js'
import { TokenService } from './token.service.js'

@Injectable()
export class AuthService {
  private readonly oauth: OAuth2Server

  constructor (
    private readonly userService: UserService,
    private readonly clientService: ClientService,
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository
  ) {
    this.oauth = createOAuth2({
      scopes,
      services: {
        userService: this.userService,
        clientService: this.clientService,
        tokenService: this.tokenService
      }
    })
  }

  public async signIn (req: Request, res: Response): Promise<OAuth2Server.Token> {
    const request = new OAuth2Server.Request(req)
    const response = new OAuth2Server.Response(res)

    return await this.oauth.token(request, response, {
      requireClientAuthentication: {
        refresh_token: false
      }
    })
  }

  async getUserInfo (req: Request): Promise<User> {
    return await this.userRepository.findOneOrFail({ where: { uuid: req.auth.user.uuid } })
  }

  public async authenticate (req: Request, res: Response): Promise<AccessTokenInterface> {
    const request = new OAuth2Server.Request(req)
    const response = new OAuth2Server.Response(res)

    const authres = await this.oauth.authenticate(request, response)

    return authres as AccessTokenInterface
  }
}
