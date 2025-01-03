import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto, UpdateTicketDto } from './dto/ticket.dto';

@Controller('tickets')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @Post()
  async createTicket(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.createTicket({ createTicketDto });
  }

  @Get()
  async getAllTickets() {
    return this.ticketService.getAllTickets();
  }

  @Get(':id')
  async getTicketById(@Param('id') id: string) {
    return this.ticketService.getTicketById(Number(id));
  }

  @Put(':id')
  async updateTicket(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.ticketService.updateTicket(Number(id), updateTicketDto);
  }

  @Delete(':id')
  async deleteTicket(@Param('id') id: string) {
    return this.ticketService.deleteTicket(Number(id));
  }
}
