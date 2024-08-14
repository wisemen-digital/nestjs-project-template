import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Delete, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common'
import { UpdateUserGuard } from '../../guards/user-update.guard.js'
import { DeleteUserUseCase } from './delete-user.use-case.js'

@ApiTags('User')
@Controller('users/:user')
export class DeleteUserController {
  constructor (
    private readonly useCase: DeleteUserUseCase
  ) {}

  @Delete()
  @UseGuards(UpdateUserGuard)
  @ApiOkResponse()
  async createUser (
    @Param('user', ParseUUIDPipe) userUuid: string
  ): Promise<void> {
    await this.useCase.delete(userUuid)
  }
}
