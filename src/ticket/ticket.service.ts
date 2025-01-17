import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TicketRepository } from './ticket.repository';
import { CreateTicketDto, UpdateTicketDto } from './dto/ticket.dto';
import { BaseRepository } from 'src/common/repository/base.repository';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TicketService {
  constructor(
    private ticketRepository: TicketRepository,
    private baseRepository: BaseRepository,
    private readonly emailService: EmailService,
    private prisma: PrismaService,
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
    const originalTicket = await this.baseRepository.findById('ticket', id);

    if (!originalTicket) {
      throw new NotFoundException('Ticket does not exist.');
    }

    const user = await this.baseRepository.findById('user', userId);
    if (userId === originalTicket.assigneeId || (user && user.roleId === 1)) {
      const orgFieldNames = (
        await this.prisma.ticket.findUnique({
          where: { id: originalTicket.id },
          include: { fields: true },
        })
      ).fields
        .map((field) => field.fieldName)
        .join(', ');

      // Performing the update
      const updatedTicket = await this.ticketRepository.updateTicket(
        id,
        updateTicketDto,
        userId,
      );
      const updatedFieldNames = (
        await this.prisma.ticket.findUnique({
          where: { id: originalTicket.id },
          include: { fields: true },
        })
      ).fields
        .map((field) => field.fieldName)
        .join(', ');

      console.log('org:', orgFieldNames);
      console.log('service:', updatedFieldNames);

      // Detect updated fields with old and new values
      const updatedFields: Record<string, { old: any; new: any }> = {};

      // Mapping field names to more user-friendly labels
      const fieldMapping = {
        assignedToId: 'Assigned To',
        status: 'Ticket Status',
        name: 'Ticket Name',
        description: 'Description',
        fieldIds: 'Selected Fields',
      };

      for (const key in updateTicketDto) {
        if (
          updateTicketDto[key] !== undefined &&
          updateTicketDto[key] !== originalTicket[key]
        ) {
          // Handle special case for assignedToId
          if (key === 'assignedToId') {
            const oldUser = await this.baseRepository.findById(
              'user',
              originalTicket[key],
            );
            const newUser = await this.baseRepository.findById(
              'user',
              updateTicketDto[key],
            );
            updatedFields[key] = {
              old: oldUser ? oldUser.username : 'N/A',
              new: newUser ? newUser.username : 'N/A',
            };
          } else {
            updatedFields[key] = {
              old: originalTicket[key],
              new: updateTicketDto[key],
            };
          }
        }
      }

      // Add the field name replacements to the updatedFields
      if (updateTicketDto.fieldIds && updateTicketDto.fieldIds.length > 0) {
        updatedFields['Selected Fields'] = {
          old: orgFieldNames,
          new: updatedFieldNames,
        };
      }

      // Map the keys to user-friendly names
      const mappedFields: Record<string, { old: any; new: any }> = {};
      for (const key in updatedFields) {
        const mappedKey = fieldMapping[key] || key; // Use the original key if no mapping exists
        mappedFields[mappedKey] = updatedFields[key];
      }

      // Send update notification email if any field is updated
      if (Object.keys(mappedFields).length > 0) {
        await this.sendTicketUpdateEmail(originalTicket, mappedFields);
      }

      return updatedTicket;
    } else {
      throw new ForbiddenException(
        'Access denied for performing this operation!',
      );
    }
  }

  // Method to send an email with updated fields
  async sendTicketUpdateEmail(
    originalTicket: any,
    updatedFields: Record<string, { old: any; new: any }>,
  ) {
    const subject = `Updates received on Ticket: ${originalTicket.id}`;
    const html = this.emailService.renderTemplate('ticket-updation-template', {
      ticketId: originalTicket.id,
      updatedFields,
    });

    await this.emailService.sendMail('admin@example.com', subject, html);
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
