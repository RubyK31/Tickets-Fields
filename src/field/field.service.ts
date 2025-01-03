import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFieldDto, UpdateFieldDto } from './dto/field.dto';

@Injectable()
export class FieldService {
  constructor(private prisma: PrismaService) {}

  // Create a new field
  async createField(createFieldDto: CreateFieldDto) {
    return this.prisma.field.create({
      data: {
        fieldName: createFieldDto.fieldName,
        type: createFieldDto.type,
      },
    });
  }

  // Get all fields
  async getAllFields() {
    return this.prisma.field.findMany();
  }

  // Get a field by ID
  async getFieldById(id: number) {
    return this.prisma.field.findUnique({
      where: { id },
    });
  }

  // Update an existing field by ID
  async updateField(id: number, updateFieldDto: UpdateFieldDto) {
    return this.prisma.field.update({
      where: { id },
      data: {
        fieldName: updateFieldDto.fieldName,
        type: updateFieldDto.type,
      },
    });
  }

  // Delete a field by ID
  async deleteField(id: number) {
    return this.prisma.field.delete({
      where: { id },
    });
  }
}
