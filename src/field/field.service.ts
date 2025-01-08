import { Injectable } from '@nestjs/common';
import { FieldRepository } from './field.repository';
import { CreateFieldDto, UpdateFieldDto } from './dto/field.dto';

@Injectable()
export class FieldService {
  constructor(private fieldRepository: FieldRepository) {}

  // Create a new field
  async createField(createFieldDto: CreateFieldDto) {
    return this.fieldRepository.create(createFieldDto);
  }

  // Get all fields
  async getAllFields() {
    return this.fieldRepository.findAll();
  }

  // Get a field by ID
  async getFieldById(id: number) {
    return this.fieldRepository.findById(id);
  }

  // Update an existing field by ID
  async updateField(id: number, updateFieldDto: UpdateFieldDto) {
    return this.fieldRepository.update(id, updateFieldDto);
  }

  // Delete a field by ID
  async deleteField(id: number) {
    return this.fieldRepository.delete(id);
  }
}
