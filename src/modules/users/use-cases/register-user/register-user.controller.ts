import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Post } from '@nestjs/common'
import { Public } from '../../../permissions/permissions.decorator.js'
import { RegisterUserDto } from './register-user.dto.js'
import { UserRegisteredResponse } from './user-registered-response.js'
import { EmailAlreadyInUseError } from './email-already-in-use-error.js'
import { RegisterUserUseCase } from './register-user.use-case.js'

@ApiTags('User')
@Controller('users')
export class RegisterUserController {
  constructor (
    private readonly useCase: RegisterUserUseCase
  ) {
  }

  @Post()
  @ApiCreatedResponse({ type: UserRegisteredResponse })
  @ApiBadRequestResponse({ type: EmailAlreadyInUseError })
  @Public()
  async createUser (
    @Body() createUserDto: RegisterUserDto
  ): Promise<UserRegisteredResponse> {
    const user = await this.useCase.create(createUserDto)
    return new UserRegisteredResponse(user)
  }
}
