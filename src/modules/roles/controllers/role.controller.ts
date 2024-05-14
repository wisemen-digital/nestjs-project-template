import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { RoleTransformer, RoleTransformerType } from '../transformers/role.transformer.js'
import { CreateRoleDto } from '../dtos/create-role.dto.js'
import { RoleCount } from '../transformers/role-count.type.js'
import { RoleService } from '../services/role.service.js'
import { UpdateRolesBulkDto } from '../dtos/update-roles-bulk.dto.js'
import { Permissions } from '../../permissions/permissions.decorator.js'
import { Permission } from '../../permissions/permission.enum.js'

@ApiTags('roles')
@Controller('roles')
export class RoleController {
  constructor (
    private readonly roleService: RoleService
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The roles has been successfully received.',
    type: [RoleTransformerType]
  })
  @Permissions(Permission.ROLE_READ)
  async getRoles (): Promise<RoleTransformerType[]> {
    const roles = await this.roleService.findAll()

    return new RoleTransformer().array(roles)
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The role has been successfully created.',
    type: RoleTransformerType
  })
  @Permissions(Permission.ROLE_CREATE)
  async createRole (
    @Body() createRoleDto: CreateRoleDto
  ): Promise<RoleTransformerType> {
    const role = await this.roleService.create(createRoleDto)

    return new RoleTransformer().item(role)
  }

  @Post('bulk')
  @ApiResponse({
    status: 201,
    description: 'The roles has been successfully created.',
    type: [RoleTransformerType]
  })
  @Permissions(Permission.ROLE_UPDATE)
  async updateRolesBulk (
    @Body() updateRolesBulk: UpdateRolesBulkDto
  ): Promise<RoleTransformerType[]> {
    const roles = await this.roleService.updateBulk(updateRolesBulk)

    return new RoleTransformer().array(roles)
  }

  @Get(':role')
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully received.',
    type: RoleTransformerType
  })
  @Permissions(Permission.ROLE_READ)
  async getRole (
    @Param('role', ParseUUIDPipe) uuid: string
  ): Promise<RoleTransformerType> {
    const role = await this.roleService.findOne(uuid)

    return new RoleTransformer().item(role)
  }

  @Post(':role')
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully updated.',
    type: RoleTransformerType
  })
  @Permissions(Permission.ROLE_UPDATE)
  async updateRole (
    @Body() updateRoleDto: CreateRoleDto,
    @Param('role', ParseUUIDPipe) uuid: string
  ): Promise<RoleTransformerType> {
    const role = await this.roleService.update(uuid, updateRoleDto)

    return new RoleTransformer().item(role)
  }

  @Delete(':role')
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully deleted.'
  })
  @Permissions(Permission.ROLE_DELETE)
  async deleteRole (
    @Param('role', ParseUUIDPipe) uuid: string
  ): Promise<void> {
    await this.roleService.delete(uuid)
  }

  @Post(':role/count')
  @ApiResponse({
    status: 200,
    description: 'The role count has been successfully received.',
    type: RoleCount
  })
  @Permissions(Permission.ROLE_READ)
  async getRoleCount (
    @Param('role', ParseUUIDPipe) uuid: string
  ): Promise<RoleCount> {
    const count = await this.roleService.count(uuid)

    return { count }
  }
}
