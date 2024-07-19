import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RoleTransformer, type RoleTransformerType } from '../transformers/role.transformer.js'
import { CreateRoleDto } from '../dtos/create-role.dto.js'
import { RoleCountTransformer, type RoleCountTransformerType } from '../transformers/role-count.transformer.js'
import { RoleService } from '../services/role.service.js'
import { UpdateRolesBulkDto } from '../dtos/update-roles-bulk.dto.js'
import { Permissions } from '../../permissions/decorators/permissions.decorator.js'
import { Permission } from '../../permissions/enums/permission.enum.js'
import { getRolesResponse, createRoleResponse, updateRolesBulkResponse, deleteRoleResponse, getRoleCountResponse, getRoleResponse, updateRoleResponse } from '../docs/role-response.docs.js'

@ApiTags('Roles')
@Controller('roles')
@ApiBearerAuth()
export class RoleController {
  constructor (
    private readonly roleService: RoleService
  ) {}

  @Get('/')
  @ApiResponse(getRolesResponse)
  @Permissions(Permission.ROLE_READ)
  public async getRoles (): Promise<RoleTransformerType[]> {
    const roles = await this.roleService.findAll()
    return new RoleTransformer().array(roles)
  }

  @Post('/')
  @ApiResponse(createRoleResponse)
  @Permissions(Permission.ROLE_CREATE)
  public async createRole (
    @Body() createRoleDto: CreateRoleDto
  ): Promise<RoleTransformerType> {
    const role = await this.roleService.create(createRoleDto)
    return new RoleTransformer().item(role)
  }

  @Post('/bulk')
  @ApiResponse(updateRolesBulkResponse)
  @Permissions(Permission.ROLE_UPDATE)
  public async updateRolesBulk (
    @Body() updateRolesBulk: UpdateRolesBulkDto
  ): Promise<RoleTransformerType[]> {
    const roles = await this.roleService.updateBulk(updateRolesBulk)
    return new RoleTransformer().array(roles)
  }

  @Get('/:roleUuid')
  @ApiResponse(getRoleResponse)
  @Permissions(Permission.ROLE_READ)
  public async getRole (
    @Param('roleUuid', ParseUUIDPipe) roleUuid: string
  ): Promise<RoleTransformerType> {
    const role = await this.roleService.findOne(roleUuid)
    return new RoleTransformer().item(role)
  }

  @Post('/:roleUuid')
  @ApiResponse(updateRoleResponse)
  @Permissions(Permission.ROLE_UPDATE)
  public async updateRole (
    @Param('roleUuid', ParseUUIDPipe) roleUuid: string,
    @Body() updateRoleDto: CreateRoleDto
  ): Promise<RoleTransformerType> {
    const role = await this.roleService.update(roleUuid, updateRoleDto)
    return new RoleTransformer().item(role)
  }

  @Delete('/:roleUuid')
  @ApiResponse(deleteRoleResponse)
  @Permissions(Permission.ROLE_DELETE)
  public async deleteRole (
    @Param('roleUuid', ParseUUIDPipe) roleUuid: string
  ): Promise<void> {
    await this.roleService.delete(roleUuid)
  }

  @Get('/:roleUuid/count')
  @ApiResponse(getRoleCountResponse)
  @Permissions(Permission.ROLE_READ)
  public async getRoleCount (
    @Param('roleUuid', ParseUUIDPipe) roleUuid: string
  ): Promise<RoleCountTransformerType> {
    const count = await this.roleService.count(roleUuid)
    return new RoleCountTransformer().item(count)
  }
}
