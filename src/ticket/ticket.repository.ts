import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto, UpdateTicketDto } from './dto/ticket.dto';
import { Ticket } from '@prisma/client';
import { BaseRepository } from 'src/common/base.repository';

@Injectable()
export class TicketRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findTicketsByUserId(userId: number) {
    const tickets = await this.prisma.ticket.findMany({
      where: {
        assignedToId: userId,
      },
      include: { fields: true },
    });
    const count = tickets.length;
    return {
      count: count,
      data: tickets,
    };
  }

  async filterTickets(
    name?: string,
    status?: string,
    sortDirection: 'asc' | 'desc' = 'desc', // Default descending
  ) {
    if (!['asc', 'desc'].includes(sortDirection)) {
      throw new BadRequestException(
        'Invalid sort direction! Sorting allowed in asc or desc order.',
      );
    }

    const tickets = await this.prisma.ticket.findMany({
      where: {
        AND: [
          name ? { name: { contains: name, mode: 'insensitive' } } : {},
          status ? { status: { equals: status, mode: 'insensitive' } } : {},
        ],
      },
      include: { fields: true },
      orderBy: { id: sortDirection },
    });
    const count = tickets.length;
    return {
      count: count,
      data: tickets,
    };
  }

  async createTicket(
    createTicketDto: CreateTicketDto,
    userId: number,
  ): Promise<Ticket> {
    const { fieldIds, assignedToId, ...ticketData } = createTicketDto;

    //Handle Ticket Assignment
    await this.handleTicketAssign(userId, assignedToId);

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

    //Handle Ticket Assignment
    await this.handleTicketAssign(userId, assignedToId);

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
            throw new ConflictException(
              `Field with name: '${fieldIdOrObj.fieldName}' and type: '${fieldIdOrObj.type}' already exists.`,
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

  private async handleTicketAssign(userId: number, assignedToId: number) {
    if (assignedToId) {
      const assignedUser = await this.prisma.user.findUnique({
        where: { id: assignedToId },
      });

      if (!assignedUser) {
        throw new NotFoundException(
          `Ticket can not be assigned to a non existing user.`,
        );
      }
    }
    if (assignedToId === userId) {
      throw new BadRequestException(
        'Ticket Assignee and Ticket Assigned to fields can not have same ids',
      );
    }
  }
}
