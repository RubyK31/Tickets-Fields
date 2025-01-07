import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketDto, UpdateTicketDto } from './dto/ticket.dto';
import { Ticket } from '@prisma/client';

@Injectable()
export class TicketRepository {
  constructor(private prisma: PrismaService) {}

  // Create a new ticket
  async create(
    createTicketDto: CreateTicketDto,
    userId: number,
  ): Promise<{ message: string; data: Ticket }> {
    const { fieldIds, assignedToId, ...ticketData } = createTicketDto;

    if (assignedToId && assignedToId === userId) {
      throw new BadRequestException(
        'Ticket Assignee and Assigned User cannot be the same.',
      );
    }

    const assignedUser = assignedToId
      ? await this.prisma.user.findUnique({ where: { id: assignedToId } })
      : null;
    if (assignedToId && !assignedUser) {
      throw new NotFoundException(`User with ID ${assignedToId} not found.`);
    }

    const fields = await this.handleFields(fieldIds);

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

  // Get all tickets
  async findAll(): Promise<Ticket[]> {
    return this.prisma.ticket.findMany({ include: { fields: true } });
  }

  // Get ticket by ID
  async findById(id: number): Promise<Ticket> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { fields: true },
    });
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found.`);
    }
    return ticket;
  }

  // Update a ticket
  async update(
    id: number,
    updateTicketDto: UpdateTicketDto,
    userId: number,
  ): Promise<{ message: string; data: Ticket }> {
    const { fieldIds, assignedToId, ...ticketData } = updateTicketDto;

    const currentTicket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { fields: true },
    });

    if (!currentTicket) {
      throw new NotFoundException(`Ticket with ID ${id} not found.`);
    }

    if (assignedToId && assignedToId === userId) {
      throw new BadRequestException(
        'Ticket Assignee and Assigned User cannot be the same.',
      );
    }

    const assignedUser = assignedToId
      ? await this.prisma.user.findUnique({ where: { id: assignedToId } })
      : null;
    if (assignedToId && !assignedUser) {
      throw new NotFoundException(`User with ID ${assignedToId} not found.`);
    }

    const fields = await this.handleFields(fieldIds);

    const updatedTicket = await this.prisma.ticket.update({
      where: { id },
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
      message: 'Ticket updated successfully',
      data: updatedTicket,
    };
  }

  // Delete a ticket
  async delete(id: number): Promise<Ticket> {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found.`);
    }

    return this.prisma.ticket.delete({ where: { id } });
  }

  // Get tickets assigned to a specific user
  async findByUserId(userId: number): Promise<Ticket[]> {
    return this.prisma.ticket.findMany({
      where: { assignedToId: userId },
    });
  }

  // Handle field validation and creation
  private async handleFields(fieldIds: any[]): Promise<any[]> {
    return Promise.all(
      fieldIds.map(async (fieldIdOrObj) => {
        if (typeof fieldIdOrObj === 'number') {
          const field = await this.prisma.field.findUnique({
            where: { id: fieldIdOrObj },
          });
          if (!field) {
            throw new NotFoundException(
              `Field with ID ${fieldIdOrObj} not found.`,
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
          return this.prisma.field.create({
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
