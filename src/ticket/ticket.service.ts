import { Injectable } from '@nestjs/common';
import { TicketRepository } from './ticket.repository';
import { CreateTicketDto, UpdateTicketDto } from './dto/ticket.dto';

@Injectable()
export class TicketService {
  constructor(private ticketRepository: TicketRepository) {}

  async createTicket(createTicketDto: CreateTicketDto, userId: number) {
    // Call repository method for ticket creation
    return this.ticketRepository.createTicket(createTicketDto, userId);
  }

  async getAllTickets() {
    return this.ticketRepository.getAllTickets();
  }

  async getTicketById(id: number) {
    return this.ticketRepository.getTicketById(id);
  }

  async updateTicket(
    id: string,
    updateTicketDto: UpdateTicketDto,
    userId: number,
  ) {
    return this.ticketRepository.updateTicket(id, updateTicketDto, userId);
  }

  async deleteTicket(id: number) {
    return this.ticketRepository.deleteTicket(id);
  }

  async findTicketsByUserId(userId: number) {
    return this.ticketRepository.findTicketsByUserId(userId);
  }
}
