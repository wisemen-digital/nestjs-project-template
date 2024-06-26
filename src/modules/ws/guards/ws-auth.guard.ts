import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../../users/services/user.service.js'
import { TokenService } from '../../auth/services/token.service.js'

@Injectable()
export class WsAuthGuard {
  constructor (
    private readonly tokenService: TokenService,
    private readonly userService: UserService
  ) {}

  public async verifyAuthorization (header: string): Promise<void> {
    if (header == null) {
      throw new UnauthorizedException()
    }

    const [bearer, token] = header.split(' ')

    if (bearer !== 'Bearer' || token == null) {
      throw new UnauthorizedException()
    }

    const decoded = await this.tokenService.getAccessToken(token)
    if (decoded === false) {
      throw new UnauthorizedException()
    }
    const user = await this.userService.findOne(decoded.uid)
    if (user == null) {
      throw new UnauthorizedException()
    }
  }
}
