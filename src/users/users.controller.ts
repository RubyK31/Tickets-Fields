import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleGuard } from 'src/auth/role.guard';

function createResponse(message: string, totalCount: number, data: any = null) {
  return {
    message,
    totalCount,
    data,
  };
}

@ApiTags('Users') // Group APIs under 'Users' in Swagger
@ApiBearerAuth() // Add Bearer auth option in Swagger
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(@Query('pagenumber') pagenumber?: number) {
    const pageNumber = pagenumber ? pagenumber : 1;
    const users = await this.usersService.getAllUsers(pageNumber);
    return createResponse(
      'All users retrieved successfully',
      users.totalRecords,
      users.data,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  async getUserById(@Param('id') id: number) {
    const user = await this.usersService.getUserById(id);
    return createResponse('Given user retrieved successfully', 1, user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  async updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
    const user = await this.usersService.updateUser(Number(id), body);
    return createResponse('User updated successfully', 1, user);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  async deleteRole(@Param('id') id: number) {
    await this.usersService.deleteUser(id);
    return {
      message: 'User deleted successfully',
    };
  }
}
