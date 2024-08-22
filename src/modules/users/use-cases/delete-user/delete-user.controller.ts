import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Delete, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common'
import { UserSelfOrAdminGuard } from '../../guards/user-self-or-admin.guard.js'
import { DeleteUserUseCase } from './delete-user.use-case.js'

@ApiTags('User')
@Controller('users/:user')
export class DeleteUserController {
  constructor (
    private readonly useCase: DeleteUserUseCase
  ) {}

  @Delete()
  @UseGuards(UserSelfOrAdminGuard)
  @ApiOkResponse()
  async deleteUser (
    @Param('user', ParseUUIDPipe) userUuid: string
  ): Promise<void> {
    await this.useCase.delete(userUuid)
  }
}
