import { Controller, Get, Post, Req, Res } from '@nestjs/common'
import { Response } from 'express'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AuthService } from '../services/auth.service.js'
import { Permissions, Public } from '../../permissions/decorators/permissions.decorator.js'
import { Request } from '../guards/auth.guard.js'
import { AuthTransformer } from '../transformers/auth.transformer.js'
import { CREATE_TOKEN_RESPONSE, GET_USER_INFO_RESPONSE } from '../docs/auth-response.docs.js'
import { type UserTransformerType, UserTransformer } from '../../users/transformers/user.transformer.js'
import { ApiOneOfBody } from '../../../utils/decorators/api-one-of-body.util.js'
import { PasswordGrantBody } from '../types/password-grant.body.js'
import { RefreshGrantBody } from '../types/refresh-grant.body.js'
import { Permission } from '../../permissions/enums/permission.enum.js'

@ApiTags('Authentication')
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
  @ApiCreatedResponse(CREATE_TOKEN_RESPONSE)
  @ApiOneOfBody(PasswordGrantBody, RefreshGrantBody)
  public async createToken (
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
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
  @ApiBearerAuth()
  @ApiOkResponse(GET_USER_INFO_RESPONSE)
  @Permissions(Permission.USER_READ)
  public async getUserInfo (
    @Req() req: Request
  ): Promise<UserTransformerType> {
    const user = await this.authService.getUserInfo(req)
    return new UserTransformer().item(user)
  }
}
