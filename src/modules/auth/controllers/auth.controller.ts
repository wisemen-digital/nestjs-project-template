import { Controller, Get, Post, Req, Res } from '@nestjs/common'
import { Response } from 'express'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthService } from '../services/auth.service.js'
import { Public } from '../../permissions/permissions.decorator.js'
import { Request } from '../guards/auth.guard.js'
import { AuthTransformer } from '../transformers/auth.transformer.js'
import { UserTransformer, UserTransformerType } from '../../users/transformers/user.transformer.js'

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: ''
})
export class AuthController {
  constructor (
    private readonly authService: AuthService
  ) { }

  @Post('/token')
  @Public()
  public async createToken (@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const token = await this.authService.signIn(req, res)

      res.json(new AuthTransformer().item(token))
    } catch (err) {
      res.status(err.code).json({
        error: err.name,
        error_description: err.message
      })
    }
  }

  @Get('/userinfo')
  @ApiResponse({
    status: 200,
    description: 'The user info has been successfully retrieved.',
    type: UserTransformerType
  })
  public async getUserInfo (@Req() req: Request): Promise<UserTransformerType> {
    const user = await this.authService.getUserInfo(req)
    return new UserTransformer().item(user)
  }
}
