import { ForbiddenException, Injectable } from '@nestjs/common';
import { TicketRepository } from './ticket.repository';
import { CreateTicketDto, UpdateTicketDto } from './dto/ticket.dto';
import { BaseRepository } from 'src/common/repository/base.repository';

@Injectable()
export class TicketService {
  constructor(
    private ticketRepository: TicketRepository,
    private baseRepository: BaseRepository,
  ) {}

  async createTicket(createTicketDto: CreateTicketDto, userId: number) {
    return this.ticketRepository.createTicket(createTicketDto, userId);
  }

  async getAllTickets(pageNumber: number) {
    const orderBy = { updatedAt: 'desc' };
    return this.baseRepository.findAll('ticket', pageNumber, orderBy, {
      fields: true,
    });
  }

  async getTicketById(id: number, userId: number) {
    const ticket = await this.baseRepository.findById('ticket', id, {
      fields: true,
    });
    //check user is admin or is trying to get his own ticket
    const user = await this.baseRepository.findById('user', userId);
    if ((user && user.roleId === 1) || ticket.assigneeId === userId) {
      return ticket;
    }
    throw new ForbiddenException(
      'Access denied for performing this operation!',
    );
  }

  async updateTicket(
    id: number,
    updateTicketDto: UpdateTicketDto,
    userId: number,
  ) {
    return this.ticketRepository.updateTicket(id, updateTicketDto, userId);
  }

  async deleteTicket(id: number, userId: number) {
    const user = await this.baseRepository.findById('user', userId);
    const ticket = await this.baseRepository.findById('ticket', id);
    if (ticket.assigneeId === userId || (user && user.roleId === 1)) {
      return await this.baseRepository.deleteById('ticket', id);
    }
    throw new ForbiddenException(
      'Access denied for performing this operation!',
    );
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
