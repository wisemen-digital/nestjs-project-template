import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Post } from '@nestjs/common'
import { Public } from '../../../permissions/permissions.decorator.js'
import { RegisterUserCommand } from './register-user.command.js'
import { UserRegisteredResponse } from './user-registered.response.js'
import { RegisterUserUseCase } from './register-user.use-case.js'

@ApiTags('User')
@Controller('users')
export class RegisterUserController {
  constructor (
    private readonly useCase: RegisterUserUseCase
  ) {}

  @Post()
  @ApiCreatedResponse({ type: UserRegisteredResponse })
  @Public()
  async createUser (
    @Body() registerUserCommand: RegisterUserCommand
  ): Promise<UserRegisteredResponse> {
    const user = await this.useCase.register(registerUserCommand)
    return new UserRegisteredResponse(user)
  }
}
