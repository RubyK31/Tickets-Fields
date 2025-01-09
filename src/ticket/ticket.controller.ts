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
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TicketService } from './ticket.service';
import { CreateTicketDto, UpdateTicketDto } from './dto/ticket.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// Utility function to create standardized responses
function createResponse(message: string, count: number, data: any = null) {
  return {
    message,
    count,
    data,
  };
}
@ApiTags('Tickets')
@ApiBearerAuth() // Add the Bearer authentication option in Swagger
@Controller('tickets')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @Get('filter')
  async filterTickets(
    @Query('name') name?: string,
    @Query('status') status?: string,
    @Query('sortDirection') sortDirection?: 'asc' | 'desc',
  ) {
    const tickets = await this.ticketService.getFilteredTickets(
      name,
      status,
      sortDirection,
    );
    return createResponse(
      'Matching tickets retrieved successfully',
      tickets.count,
      tickets.data,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new ticket' })
  async createTicket(@Body() createTicketDto: CreateTicketDto, @Request() req) {
    const ticket = await this.ticketService.createTicket(
      createTicketDto,
      req.user.id,
    );
    return createResponse('Ticket created successfully', 1, ticket);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tickets' })
  async getAllTickets() {
    const tickets = await this.ticketService.getAllTickets();
    return createResponse(
      'All tickets retrieved successfully',
      tickets.count,
      tickets.data,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket by ID' })
  async getTicketById(@Param('id') id: string) {
    const ticket = await this.ticketService.getTicketById(Number(id));
    return createResponse('Ticket details retrieved successfully', 1, ticket);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a ticket by ID' })
  async updateTicket(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
    @Request() req,
  ) {
    const ticket = await this.ticketService.updateTicket(
      id,
      updateTicketDto,
      req.user.id,
    );
    return createResponse('Ticket details updated successfully', 1, ticket);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a ticket by ID' })
  async deleteTicket(@Param('id') id: string) {
    await this.ticketService.deleteTicket(Number(id));
    return { message: 'Ticket deleted successfully' };
  }

  //@UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get tickets assigned to a specific user' })
  async getTicketsByUserId(@Param('userId', ParseIntPipe) userId: number) {
    const tickets = await this.ticketService.findTicketsByUserId(userId);
    return createResponse(
      'Tickets for the given user retrieved successfully',
      tickets.count,
      tickets.data,
    );
  }
}
