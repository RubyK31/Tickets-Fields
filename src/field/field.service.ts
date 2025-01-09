import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/base.repository';
import { CreateFieldDto, UpdateFieldDto } from './dto/field.dto';

@Injectable()
export class FieldService {
  constructor(private baseRepository: BaseRepository) {}

  // Create a new field
  async createField(createFieldDto: CreateFieldDto) {
    const uniqueCheck = {
      fieldName: createFieldDto.fieldName,
    };
    return this.baseRepository.create('field', createFieldDto, uniqueCheck);
  }

  // Get all fields
  async getAllFields(pageNumber: number) {
    const orderBy = { id: 'desc' };
    return this.baseRepository.findAll('field', pageNumber, orderBy);
  }

  // Get a field by ID
  async getFieldById(id: number) {
    return this.baseRepository.findById('field', id);
  }

  // Update an existing field by ID
  async updateField(id: number, updateFieldDto: UpdateFieldDto) {
    const uniqueCheck = {
      fieldName: updateFieldDto.fieldName,
    };
    return this.baseRepository.update('field', id, updateFieldDto, uniqueCheck);
  }

  // Delete a field by ID
  async deleteField(id: number) {
    return this.baseRepository.deleteById('field', id);
  }
}
