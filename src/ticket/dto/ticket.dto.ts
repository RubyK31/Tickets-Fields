import {
  IsString,
  IsOptional,
  IsArray,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty({ description: 'Name of the ticket', example: 'Bug Report' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Status of the ticket', example: 'Open' })
  @IsString()
  status: string;

  @ApiPropertyOptional({
    description: 'Optional description of the ticket',
    example: 'UI bug in login form',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'ID of the user assigned to this ticket',
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  assignedToId?: number;

  @ApiProperty({
    description:
      'List of field IDs or field objects associated with the ticket',
    example: [1, { fieldName: 'Priority', type: 'String' }],
    type: [Object],
  })
  @IsArray()
  fieldIds: Array<number | { fieldName: string; type: string }>;
}

export class UpdateTicketDto {
  @ApiPropertyOptional({
    description: 'Updated name of the ticket',
    example: 'Updated Bug Report',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Updated status of the ticket',
    example: 'In Progress',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Updated description of the ticket',
    example: 'Critical bug affecting user login',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'ID of the user assigned to this ticket',
    example: 3,
  })
  @IsNumber()
  @IsOptional()
  assignedToId?: number;

  @ApiPropertyOptional({
    description:
      'Updated list of field IDs or field objects associated with the ticket',
    example: [2, { fieldName: 'Severity', type: 'String' }],
    type: [Object],
  })
  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  fieldIds: Array<number | { fieldName: string; type: string }>;
}
