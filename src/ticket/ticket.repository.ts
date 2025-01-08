import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto, UpdateTicketDto } from './dto/ticket.dto';
import { Ticket } from '@prisma/client';

@Injectable()
export class TicketRepository {
  constructor(private prisma: PrismaService) {}

  async createTicket(
    createTicketDto: CreateTicketDto,
    userId: number,
  ): Promise<Ticket> {
    const { fieldIds, assignedToId, ...ticketData } = createTicketDto;

    // Validate assignedToId
    if (assignedToId === userId) {
      throw new BadRequestException(
        'Ticket Assignee and Ticket Assigned to fields can not have same ids',
      );
    }

    if (assignedToId) {
      const assignedUser = await this.prisma.user.findUnique({
        where: { id: assignedToId },
      });

      if (!assignedUser) {
        throw new NotFoundException(
          `Ticket can not be assigned to a non existent user.`,
        );
      }
    }

    // Handle fields
    const fields = await this.handleFields(fieldIds);

    // Create the ticket
    return this.prisma.ticket.create({
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
  }

  async getAllTickets() {
    return this.prisma.ticket.findMany({
      include: { fields: true },
    });
  }

  async getTicketById(id: number): Promise<Ticket> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { fields: true },
    });

    if (!ticket) {
      throw new NotFoundException(`Given ticket does not exist.`);
    }

    return ticket;
  }

  async updateTicket(
    id: string,
    updateTicketDto: UpdateTicketDto,
    userId: number,
  ): Promise<Ticket> {
    const { fieldIds, assignedToId, ...ticketData } = updateTicketDto;

    const currentTicket = await this.prisma.ticket.findUnique({
      where: { id: Number(id) },
      include: { fields: true },
    });

    if (!currentTicket) {
      throw new NotFoundException(`Ticket does not exist.`);
    }

    // Validate assignedToId
    if (assignedToId === userId) {
      throw new BadRequestException(
        'Ticket Assignee and Ticket Assigned to fields can not have same ids',
      );
    }

    if (assignedToId) {
      const assignedUser = await this.prisma.user.findUnique({
        where: { id: assignedToId },
      });

      if (!assignedUser) {
        throw new NotFoundException(
          `Ticket can not be assigned to a new existing user.`,
        );
      }
    }

    // Handle fields
    const currentFieldIds = currentTicket.fields.map((field) => field.id) || [];
    const fields = await this.handleFields(fieldIds);

    const fieldsToDisassociate = currentFieldIds.filter(
      (fieldId) => !fieldIds.includes(fieldId),
    );

    return this.prisma.ticket.update({
      where: { id: Number(id) },
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
  }

  async deleteTicket(id: number) {
    // Check if the ticket exists
    const existingTicket = await this.prisma.ticket.findUnique({
      where: { id },
    });

    if (!existingTicket) {
      throw new NotFoundException(`Given ticket does not exist.`);
    }

    // Proceed to delete the ticket
    return this.prisma.ticket.delete({
      where: { id },
    });
  }

  async findTicketsByUserId(userId: number) {
    return this.prisma.ticket.findMany({
      where: {
        assignedToId: userId,
      },
    });
  }

  private async handleFields(fieldIds: any[]) {
    return await Promise.all(
      fieldIds.map(async (fieldIdOrObj) => {
        if (typeof fieldIdOrObj === 'number') {
          const field = await this.prisma.field.findUnique({
            where: { id: fieldIdOrObj },
          });

          if (!field) {
            throw new NotFoundException(`Field does not exist.`);
          }
          return field;
        } else {
          const existingField = await this.prisma.field.findFirst({
            where: {
              fieldName: fieldIdOrObj.fieldName,
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
