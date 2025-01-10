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
import { RoleGuard } from 'src/auth/role.guard';
// Utility function to create standardized responses
function createResponse(message: string, totalCount: number, data: any = null) {
  return {
    message,
    totalCount,
    data,
  };
}
@ApiTags('Tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
  @ApiOperation({ summary: 'Create a new ticket' })
  async createTicket(@Body() createTicketDto: CreateTicketDto, @Request() req) {
    const ticket = await this.ticketService.createTicket(
      createTicketDto,
      req.user.id,
    );
    // Send email after ticket creation
    await this.ticketService.sendTicketCreationEmail(ticket);
    return createResponse('Ticket created successfully', 1, ticket);
  }

  @UseGuards(RoleGuard)
  @Get()
  @ApiOperation({ summary: 'Get all tickets' })
  async getAllTickets(@Query('pagenumber') pagenumber?: number) {
    const pageNumber = pagenumber ? pagenumber : 1;
    const tickets = await this.ticketService.getAllTickets(pageNumber);
    return createResponse(
      'All tickets retrieved successfully',
      tickets.totalRecords,
      tickets.data,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket by ID' })
  async getTicketById(@Param('id') id: number, @Request() req) {
    const ticket = await this.ticketService.getTicketById(id, req.user.id);
    return createResponse('Ticket details retrieved successfully', 1, ticket);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a ticket by ID' })
  async updateTicket(
    @Param('id') id: number,
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
  async deleteTicket(@Param('id') id: number, @Request() req) {
    await this.ticketService.deleteTicket(id, req.user.id);
    return { message: 'Ticket deleted successfully' };
  }

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
