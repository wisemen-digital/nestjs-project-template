import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Delete, UseGuards } from '@nestjs/common'
import { UserIsSelfOrAdminGuard } from '../../guards/user-is-self-or-admin.guard.js'
import { UuidParam } from '../../../../utils/nest/decorators/uuid-param.js'
import { DeleteUserUseCase } from './delete-user.use-case.js'

@ApiTags('User')
@Controller('users/:user')
export class DeleteUserController {
  constructor (
    private readonly useCase: DeleteUserUseCase
  ) {}

  @Delete()
  @UseGuards(UserIsSelfOrAdminGuard)
  @ApiOkResponse()
  async deleteUser (
    @UuidParam('user') userUuid: string
  ): Promise<void> {
    await this.useCase.delete(userUuid)
  }
}
