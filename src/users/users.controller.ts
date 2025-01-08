import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

function createResponse(message: string, data: any = null) {
  return {
    message,
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
  @ApiOperation({ summary: 'Get all users' })
  async getAllUsers() {
    const users = await this.usersService.findAll();
    return createResponse('All users retrieved successfully', users);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.findById(Number(id));
    return createResponse(`User details retrieved successfully`, user);
  }
}
