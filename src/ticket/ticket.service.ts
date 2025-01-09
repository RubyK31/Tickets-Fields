import { Injectable } from '@nestjs/common';
import { TicketRepository } from './ticket.repository';
import { CreateTicketDto, UpdateTicketDto } from './dto/ticket.dto';
import { BaseRepository } from 'src/common/base.repository';

@Injectable()
export class TicketService {
  constructor(
    private ticketRepository: TicketRepository,
    private baseRepository: BaseRepository,
  ) {}

  async createTicket(createTicketDto: CreateTicketDto, userId: number) {
    return this.ticketRepository.createTicket(createTicketDto, userId);
  }

  async getAllTickets() {
    const orderBy = { updatedAt: 'desc' };
    return this.baseRepository.findAll('ticket', orderBy, { fields: true });
  }

  async getTicketById(id: number) {
    return this.baseRepository.findById('ticket', id, { fields: true });
  }

  async updateTicket(
    id: string,
    updateTicketDto: UpdateTicketDto,
    userId: number,
  ) {
    return this.ticketRepository.updateTicket(id, updateTicketDto, userId);
  }

  async deleteTicket(id: number) {
    return await this.baseRepository.deleteById('ticket', id);
  }

  async findTicketsByUserId(userId: number) {
    return this.ticketRepository.findTicketsByUserId(userId);
  }

  async getFilteredTickets(
    name?: string,
    status?: string,
    sortDirection?: 'asc' | 'desc',
  ) {
    return await this.ticketRepository.filterTickets(
      name,
      status,
      sortDirection,
    );
  }
}
