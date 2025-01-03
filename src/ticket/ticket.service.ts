import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto, UpdateTicketDto } from './dto/ticket.dto';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  async createTicket({
    createTicketDto,
  }: {
    createTicketDto: CreateTicketDto;
  }) {
    const { fieldIds, ...ticketData } = createTicketDto;

    // Process the fieldIds (both existing and new ones)
    const fields = await Promise.all(
      fieldIds.map(async (fieldIdOrObj) => {
        if (typeof fieldIdOrObj === 'number') {
          // If it's an ID, check if the field exists
          const field = await this.prisma.field.findUnique({
            where: { id: fieldIdOrObj },
          });

          // If the field doesn't exist, we could throw an error or handle it differently
          if (!field) {
            throw new BadRequestException(`Selected field does not exist`);
          }
          return field;
        } else {
          // If it's an object (new field data), create a new field
          const field = await this.prisma.field.create({
            data: {
              fieldName: fieldIdOrObj.fieldName, // Dynamic field name
              type: fieldIdOrObj.type, // Dynamic field type
            },
          });
          return field;
        }
      }),
    );

    // Create the ticket and associate the fields
    return this.prisma.ticket.create({
      data: {
        ...ticketData,
        fields: {
          connect: fields.map((field) => ({ id: field.id })),
        },
      },
    });
  }

  // Get all tickets
  async getAllTickets() {
    return this.prisma.ticket.findMany({
      include: {
        fields: true, // Include related fields in the result
      },
    });
  }

  // Get a ticket by ID
  async getTicketById(id: number) {
    return this.prisma.ticket.findUnique({
      where: { id },
      include: {
        fields: true, // Include related fields in the result
      },
    });
  }

  // Update a ticket
  async updateTicket(id: number, updateTicketDto: UpdateTicketDto) {
    const { fieldIds, ...ticketData } = updateTicketDto;

    // Get current ticket's associated fields
    const currentTicket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { fields: true },
    });

    const currentFieldIds =
      currentTicket?.fields.map((field) => field.id) || [];

    // Process the fieldIds (both existing and new ones)
    const fields = await Promise.all(
      fieldIds.map(async (fieldIdOrObj) => {
        if (typeof fieldIdOrObj === 'number') {
          // If it's an ID, check if the field exists
          const field = await this.prisma.field.findUnique({
            where: { id: fieldIdOrObj },
          });

          if (!field) {
            throw new Error(`Selected field does not exist`);
          }
          return field;
        } else {
          // If it's an object (new field data), create a new field
          const field = await this.prisma.field.create({
            data: {
              fieldName: fieldIdOrObj.fieldName,
              type: fieldIdOrObj.type,
            },
          });
          return field;
        }
      }),
    );

    // Determine fields to disassociate (those that were removed from the request)
    const fieldsToDisassociate = currentFieldIds.filter(
      (fieldId) => !fieldIds.includes(fieldId),
    );

    // Update the ticket and associate/disassociate fields
    return this.prisma.ticket.update({
      where: { id },
      data: {
        ...ticketData,
        fields: {
          connect: fields.map((field) => ({ id: field.id })),
          disconnect: fieldsToDisassociate.map((id) => ({ id })),
        },
      },
    });
  }

  // Delete a ticket by ID
  async deleteTicket(id: number) {
    return this.prisma.ticket.delete({
      where: { id },
    });
  }
}
