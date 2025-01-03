import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { FieldService } from './field.service';
import { CreateFieldDto, UpdateFieldDto } from './dto/field.dto';

@Controller('fields')
export class FieldController {
  constructor(private fieldService: FieldService) {}

  @Post()
  createField(@Body() body: CreateFieldDto) {
    return this.fieldService.createField(body);
  }

  @Get()
  getAllFields() {
    return this.fieldService.getAllFields();
  }

  @Get(':id')
  getFieldById(@Param('id') id: string) {
    return this.fieldService.getFieldById(Number(id));
  }

  @Put(':id')
  updateField(@Param('id') id: string, @Body() body: UpdateFieldDto) {
    return this.fieldService.updateField(Number(id), body);
  }

  @Delete(':id')
  deleteField(@Param('id') id: string) {
    return this.fieldService.deleteField(Number(id));
  }
}
