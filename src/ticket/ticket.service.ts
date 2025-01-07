import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto, UpdateTicketDto } from './dto/ticket.dto';
import { Ticket } from '@prisma/client';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  async createTicket({
    createTicketDto,
    userId,
  }: {
    createTicketDto: CreateTicketDto;
    userId: number;
  }): Promise<{ message: string; data: Ticket }> {
    const { fieldIds, assignedToId, ...ticketData } = createTicketDto;

    // Validate assignedToId
    if (assignedToId) {
      if (assignedToId === userId) {
        throw new BadRequestException(
          'Ticket Assignee and Ticket Assigned to fields can not have same ids',
        );
      }

      const assignedUser = await this.prisma.user.findUnique({
        where: { id: assignedToId },
      });

      if (!assignedUser) {
        throw new NotFoundException(
          `User with ID ${assignedToId} does not exist.`,
        );
      }
    }

    // Validate and get fields
    const fields = await this.handleFields(fieldIds);

    // Create the ticket
    const ticket = await this.prisma.ticket.create({
      data: {
        ...ticketData,
        assigneeId: userId,
        assignedToId,
        fields: {
          connect: fields.map((field) => ({ id: field.id })),
        },
      },
      include: { fields: true },
    });

    return {
      message: 'Ticket created successfully',
      data: ticket,
    };
  }

  async getAllTickets() {
    const tickets = await this.prisma.ticket.findMany({
      include: { fields: true },
    });

    return {
      message: 'All tickets retrieved successfully',
      data: tickets,
    };
  }

  async getTicketById(id: number) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { fields: true },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} does not exist.`);
    }

    return {
      message: `Ticket with ID ${id} retrieved successfully`,
      data: ticket,
    };
  }

  async updateTicket({
    id,
    updateTicketDto,
    userId,
  }: {
    id: number;
    updateTicketDto: UpdateTicketDto;
    userId: number;
  }): Promise<{ message: string; data: Ticket }> {
    const { fieldIds, assignedToId, ...ticketData } = updateTicketDto;

    const currentTicket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { fields: true },
    });

    if (!currentTicket) {
      throw new NotFoundException(`Ticket with ID ${id} does not exist.`);
    }

    // Validate assignedToId
    if (assignedToId) {
      if (assignedToId === userId) {
        throw new BadRequestException(
          'Ticket Assignee and Ticket Assigned to fields can not have same ids',
        );
      }

      const assignedUser = await this.prisma.user.findUnique({
        where: { id: assignedToId },
      });

      if (!assignedUser) {
        throw new NotFoundException(
          `User with ID ${assignedToId} does not exist.`,
        );
      }
    }

    // Validate and get fields
    const currentFieldIds = currentTicket.fields.map((field) => field.id) || [];
    const fields = await this.handleFields(fieldIds);

    const fieldsToDisassociate = currentFieldIds.filter(
      (fieldId) =>
        !fieldIds.some((fieldIdOrObj) =>
          typeof fieldIdOrObj === 'number' ? fieldIdOrObj === fieldId : false,
        ),
    );

    // Update the ticket
    const updatedTicket = await this.prisma.ticket.update({
      where: { id },
      data: {
        ...ticketData,
        assigneeId: userId,
        assignedToId,
        fields: {
          connect: fields.map((field) => ({ id: field.id })),
          disconnect: fieldsToDisassociate.map((id) => ({ id })),
        },
      },
      include: { fields: true },
    });

    return {
      message: `Ticket with ID ${id} updated successfully`,
      data: updatedTicket,
    };
  }

  async deleteTicket(id: number) {
    const deletedTicket = await this.prisma.ticket.delete({
      where: { id },
    });

    return {
      message: `Ticket with ID ${id} deleted successfully`,
      data: deletedTicket,
    };
  }

  // Find tickets assigned to a specific user (based on userId from params)
  async findTicketsByUserId(userId: number): Promise<Ticket[]> {
    return this.prisma.ticket.findMany({
      where: {
        assignedToId: userId, // Find tickets that are assigned to this user
      },
    });
  }

  private async handleFields(fieldIds: any[]): Promise<any[]> {
    return await Promise.all(
      fieldIds.map(async (fieldIdOrObj) => {
        if (typeof fieldIdOrObj === 'number') {
          const field = await this.prisma.field.findUnique({
            where: { id: fieldIdOrObj },
          });

          if (!field) {
            throw new NotFoundException(
              `Field with ID ${fieldIdOrObj} does not exist.`,
            );
          }
          return field;
        } else {
          const existingField = await this.prisma.field.findFirst({
            where: {
              fieldName: fieldIdOrObj.fieldName,
              type: fieldIdOrObj.type,
            },
          });

          if (existingField) {
            throw new BadRequestException(
              `Field '${fieldIdOrObj.fieldName}' with type '${fieldIdOrObj.type}' already exists.`,
            );
          }

          return await this.prisma.field.create({
            data: {
              fieldName: fieldIdOrObj.fieldName,
              type: fieldIdOrObj.type,
            },
          });
        }
      }),
    );
  }
}
