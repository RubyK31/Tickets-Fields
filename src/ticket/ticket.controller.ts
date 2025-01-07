import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TicketService } from './ticket.service';
import { CreateTicketDto, UpdateTicketDto } from './dto/ticket.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Tickets') // Group APIs under the 'Tickets' tag in Swagger
@ApiBearerAuth() // Add the Bearer authentication option in Swagger
@Controller('tickets')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new ticket' })
  async createTicket(@Body() createTicketDto: CreateTicketDto, @Request() req) {
    return this.ticketService.createTicket({
      createTicketDto,
      userId: req.user.id,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all tickets' })
  async getAllTickets() {
    return this.ticketService.getAllTickets();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket by ID' })
  async getTicketById(@Param('id') id: string) {
    return this.ticketService.getTicketById(Number(id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a ticket by ID' })
  async updateTicket(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
    @Request() req,
  ) {
    return this.ticketService.updateTicket({
      id: Number(id),
      updateTicketDto,
      userId: req.user.id,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a ticket by ID' })
  async deleteTicket(@Param('id') id: string) {
    return this.ticketService.deleteTicket(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get tickets assigned to a specific user' })
  async getTicketsByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.ticketService.findTicketsByUserId(userId);
  }
}
