import { Body, Controller, Delete, Get, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { RoleTransformer, type RoleTransformerType } from '../transformers/role.transformer.js'
import { CreateRoleDto } from '../dtos/create-role.dto.js'
import { RoleCountTransformer, type RoleCountTransformerType } from '../transformers/role-count.transformer.js'
import { RoleService } from '../services/role.service.js'
import { UpdateRolesBulkDto } from '../dtos/update-roles-bulk.dto.js'
import { Permissions } from '../../permissions/decorators/permissions.decorator.js'
import { Permission } from '../../permissions/enums/permission.enum.js'
import { GET_ROLES_RESPONSE, CREATE_ROLE_RESPONSE, UPDATE_ROLES_BULK_RESPONSE, DELETE_ROLE_RESPONSE, GET_ROLE_COUNT_RESPONSE, GET_ROLE_RESPONSE, UPDATE_ROLE_RESPONSE } from '../docs/role-response.docs.js'
import { UuidParam } from '../../../utils/params/uuid-param.utiil.js'
import { UpdateRoleDto } from '../dtos/update-role.dto.js'

@ApiTags('Roles')
@Controller('roles')
@ApiBearerAuth()
export class RoleController {
  constructor (
    private readonly roleService: RoleService
  ) {}

  @Get('/')
  @ApiOkResponse(GET_ROLES_RESPONSE)
  @Permissions(Permission.ROLE_READ)
  public async getRoles (): Promise<RoleTransformerType[]> {
    const roles = await this.roleService.findAll()
    return new RoleTransformer().array(roles)
  }

  @Post('/')
  @ApiCreatedResponse(CREATE_ROLE_RESPONSE)
  @Permissions(Permission.ROLE_CREATE)
  public async createRole (
    @Body() createRoleDto: CreateRoleDto
  ): Promise<RoleTransformerType> {
    const role = await this.roleService.create(createRoleDto)
    return new RoleTransformer().item(role)
  }

  @Post('/bulk')
  @ApiCreatedResponse(UPDATE_ROLES_BULK_RESPONSE)
  @Permissions(Permission.ROLE_UPDATE)
  public async updateRolesBulk (
    @Body() updateRolesBulk: UpdateRolesBulkDto
  ): Promise<RoleTransformerType[]> {
    const roles = await this.roleService.updateBulk(updateRolesBulk)
    return new RoleTransformer().array(roles)
  }

  @Get('/:roleUuid')
  @ApiOkResponse(GET_ROLE_RESPONSE)
  @Permissions(Permission.ROLE_READ)
  public async getRole (
    @UuidParam('roleUuid') roleUuid: string
  ): Promise<RoleTransformerType> {
    const role = await this.roleService.findOne(roleUuid)
    return new RoleTransformer().item(role)
  }

  @Post('/:roleUuid')
  @ApiCreatedResponse(UPDATE_ROLE_RESPONSE)
  @Permissions(Permission.ROLE_UPDATE)
  public async updateRole (
    @UuidParam('roleUuid') roleUuid: string,
    @Body() updateRoleDto: UpdateRoleDto
  ): Promise<RoleTransformerType> {
    const role = await this.roleService.update(roleUuid, updateRoleDto)
    return new RoleTransformer().item(role)
  }

  @Delete('/:roleUuid')
  @ApiOkResponse(DELETE_ROLE_RESPONSE)
  @Permissions(Permission.ROLE_DELETE)
  public async deleteRole (
    @UuidParam('roleUuid') roleUuid: string
  ): Promise<void> {
    await this.roleService.delete(roleUuid)
  }

  @Get('/:roleUuid/count')
  @ApiOkResponse(GET_ROLE_COUNT_RESPONSE)
  @Permissions(Permission.ROLE_READ)
  public async getRoleCount (
    @UuidParam('roleUuid') roleUuid: string
  ): Promise<RoleCountTransformerType> {
    const count = await this.roleService.count(roleUuid)
    return new RoleCountTransformer().item(count)
  }
}
