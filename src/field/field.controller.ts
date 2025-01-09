import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { FieldService } from './field.service';
import { CreateFieldDto, UpdateFieldDto } from './dto/field.dto';

// Utility function to create standardized responses
function createResponse(message: string, totalCount: number, data: any = null) {
  return {
    message,
    totalCount,
    data,
  };
}

@ApiTags('Fields')
@Controller('fields')
export class FieldController {
  constructor(private fieldService: FieldService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new field' })
  async createField(@Body() body: CreateFieldDto) {
    const field = await this.fieldService.createField(body);
    return createResponse('Field created successfully', 1, field);
  }

  @Get()
  @ApiOperation({ summary: 'Get all fields' })
  async getAllFields(@Query('pagenumber') pagenumber?: number) {
    const pageNumber = pagenumber ? pagenumber : 1;
    const fields = await this.fieldService.getAllFields(pageNumber);
    return createResponse(
      'All fields retrieved successfully',
      fields.totalRecords,
      fields.data,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a field by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Field ID' })
  async getFieldById(@Param('id') id: string) {
    const field = await this.fieldService.getFieldById(Number(id));
    return createResponse(`Given field retrieved successfully`, 1, field);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a field by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Field ID' })
  async updateField(@Param('id') id: string, @Body() body: UpdateFieldDto) {
    const updatedField = await this.fieldService.updateField(Number(id), body);
    return createResponse('Field updated successfully', 1, updatedField);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a field by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Field ID' })
  async deleteField(@Param('id') id: string) {
    await this.fieldService.deleteField(Number(id));
    return {
      message: 'Field deleted successfully',
    };
  }
}
