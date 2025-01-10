import { ForbiddenException, Injectable } from '@nestjs/common';
import { TicketRepository } from './ticket.repository';
import { CreateTicketDto, UpdateTicketDto } from './dto/ticket.dto';
import { BaseRepository } from 'src/common/repository/base.repository';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class TicketService {
  constructor(
    private ticketRepository: TicketRepository,
    private baseRepository: BaseRepository,
    private readonly emailService: EmailService,
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

  // Method to send an email after ticket creation
  async sendTicketCreationEmail(ticket: any) {
    const subject = `New Ticket Added`;
    //const text = `Hi Admin\n\nA new ticket with id: ${ticket.id} has been added to the system.\n\nFollowing are the ticket details.\n\nName of the ticket: ${ticket.name}\nDescription of the ticket: ${ticket.description}\nUser ID of the Ticket assignee: ${ticket.assigneeId}\n\nRegards,\nSupport Team`;

    // Prepare data to be passed into the HTML template
    const htmlData = {
      ticketId: ticket.id,
      ticketName: ticket.name,
      ticketDescription: ticket.description,
      assignedUserId: ticket.assigneeId,
    };

    // Render the HTML template with the ticket data
    const html = this.emailService.renderTemplate(
      'ticket-creation-template',
      htmlData,
    );

    await this.emailService.sendMail('admin@example.com', subject, html);
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
