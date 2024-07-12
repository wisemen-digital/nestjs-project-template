import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Post } from '@nestjs/common'
import { Public } from '../../../permissions/permissions.decorator.js'
import { RegisterUserRequest } from './register-user.request.js'
import { UserRegisteredResponse } from './user-registered.response.js'
import { EmailAlreadyInUseError } from './email-already-in-use-error.js'
import { RegisterUserUseCase } from './register-user.use-case.js'

@ApiTags('User')
@Controller('users')
export class RegisterUserController {
  constructor (
    private readonly useCase: RegisterUserUseCase
  ) {}

  @Post()
  @ApiCreatedResponse({ type: UserRegisteredResponse })
  @ApiBadRequestResponse({ type: EmailAlreadyInUseError })
  @Public()
  async createUser (
    @Body() registerUserRequest: RegisterUserRequest
  ): Promise<UserRegisteredResponse> {
    const user = await this.useCase.create(registerUserRequest)
    return new UserRegisteredResponse(user)
  }
}
