import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFieldDto, UpdateFieldDto } from './dto/field.dto';

@Injectable()
export class FieldRepository {
  constructor(private prisma: PrismaService) {}

  // Find a field by name and type
  async findField(fieldName: string, type: string) {
    return this.prisma.field.findFirst({
      where: {
        fieldName,
        type,
      },
    });
  }

  // Find a field by ID
  async findById(id: number) {
    const field = await this.prisma.field.findUnique({
      where: { id },
    });
    if (!field) {
      throw new NotFoundException(`Field with ID ${id} does not exist.`);
    }
    return field;
  }

  // Get all fields
  async findAll() {
    return this.prisma.field.findMany();
  }

  // Create a new field
  async create(createFieldDto: CreateFieldDto) {
    const existingField = await this.findField(
      createFieldDto.fieldName,
      createFieldDto.type,
    );
    const sameNameField = await this.prisma.field.findFirst({
      where: { fieldName: createFieldDto.fieldName },
    });

    if (existingField || sameNameField) {
      throw new BadRequestException(`Given field already exists.`);
    }

    return this.prisma.field.create({
      data: {
        fieldName: createFieldDto.fieldName,
        type: createFieldDto.type,
      },
    });
  }

  // Update an existing field
  async update(id: number, updateFieldDto: UpdateFieldDto) {
    const existingField = await this.findById(id);

    const fieldNameExists = await this.findField(
      updateFieldDto.fieldName,
      updateFieldDto.type,
    );
    const sameNameField = await this.prisma.field.findFirst({
      where: { fieldName: updateFieldDto.fieldName },
    });
    if (
      (fieldNameExists && fieldNameExists.id !== existingField.id) ||
      (sameNameField && sameNameField.id !== existingField.id)
    ) {
      throw new ConflictException(
        `Field with name '${updateFieldDto.fieldName}' already exists.`,
      );
    }

    return this.prisma.field.update({
      where: { id },
      data: {
        fieldName: updateFieldDto.fieldName,
        type: updateFieldDto.type,
      },
    });
  }

  // Delete a field by ID
  async delete(id: number) {
    return this.prisma.field.delete({
      where: { id },
    });
  }
}
