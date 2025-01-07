import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Users') // Group APIs under the 'Users' tag in Swagger
@ApiBearerAuth() // Add the Bearer authentication option in Swagger
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Route to get all users
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async getAllUsers(): Promise<any> {
    return this.usersService.findAll();
  }

  // Route to get a user by ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  async getUserById(@Param('id') id: number): Promise<any> {
    return this.usersService.findById(id);
  }
}
