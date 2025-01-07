import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { FieldService } from './field.service';
import { CreateFieldDto, UpdateFieldDto } from './dto/field.dto';

@ApiTags('Fields')
@Controller('fields')
export class FieldController {
  constructor(private fieldService: FieldService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new field' })
  async createField(@Body() body: CreateFieldDto) {
    try {
      const field = await this.fieldService.createField(body);
      return {
        message: 'Field created successfully',
        data: field,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred while creating the field',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all fields' })
  async getAllFields() {
    try {
      const fields = await this.fieldService.getAllFields();
      return {
        message: 'All fields retrieved successfully',
        data: fields,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred while retrieving all fields',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a field by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Field ID' })
  async getFieldById(@Param('id') id: string) {
    try {
      const field = await this.fieldService.getFieldById(Number(id));
      return {
        message: `Field with ID ${id} retrieved successfully`,
        data: field,
      };
    } catch (error) {
      throw new HttpException(
        error.message ||
          `An error occurred while retrieving field with ID ${id}`,
        error.status || HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a field by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Field ID' })
  async updateField(@Param('id') id: string, @Body() body: UpdateFieldDto) {
    try {
      const updatedField = await this.fieldService.updateField(
        Number(id),
        body,
      );
      return {
        message: 'Field updated successfully',
        data: updatedField,
      };
    } catch (error) {
      throw new HttpException(
        error.message || `An error occurred while updating field with ID ${id}`,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a field by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Field ID' })
  async deleteField(@Param('id') id: string) {
    try {
      const deletedField = await this.fieldService.deleteField(Number(id));
      return {
        message: 'Field deleted successfully',
        data: deletedField,
      };
    } catch (error) {
      throw new HttpException(
        error.message || `An error occurred while deleting field with ID ${id}`,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
