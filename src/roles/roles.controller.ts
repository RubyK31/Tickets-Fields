import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { RoleService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role.guard';

// Utility function to create standardized responses
function createResponse(message: string, totalCount: number, data: any = null) {
  return {
    message,
    totalCount,
    data,
  };
}

@UseGuards(JwtAuthGuard, RoleGuard)
@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  async createRole(@Body() body: CreateRoleDto) {
    const role = await this.roleService.createRole(body);
    return createResponse('Role created successfully', 1, role);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  async getAllRoles(@Query('pagenumber') pagenumber?: number) {
    const pageNumber = pagenumber ? pagenumber : 1;
    const roles = await this.roleService.getAllRoles(pageNumber);
    return createResponse(
      'All roles retrieved successfully',
      roles.totalRecords,
      roles.data,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Role ID' })
  async getRoleById(@Param('id') id: string) {
    const role = await this.roleService.getRoleById(Number(id));
    return createResponse('Given role retrieved successfully', 1, role);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a role by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Role ID' })
  async updateRole(@Param('id') id: string, @Body() body: UpdateRoleDto) {
    const updatedRole = await this.roleService.updateRole(Number(id), body);
    return createResponse('Role updated successfully', 1, updatedRole);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Role ID' })
  async deleteRole(@Param('id') id: string) {
    await this.roleService.deleteRole(Number(id));
    return {
      message: 'Role deleted successfully',
    };
  }
}
