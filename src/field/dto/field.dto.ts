import { IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFieldDto {
  @ApiProperty({ description: 'Name of the field', example: 'FieldName1' })
  @IsString()
  fieldName: string;

  @ApiProperty({ description: 'Type of the field', example: 'String' })
  @IsString()
  type: string;
}

export class UpdateFieldDto {
  @ApiPropertyOptional({
    description: 'Name of the field',
    example: 'UpdatedFieldName',
  })
  @IsOptional()
  @IsString()
  fieldName?: string;

  @ApiPropertyOptional({ description: 'Type of the field', example: 'Number' })
  @IsOptional()
  @IsString()
  type?: string;
}
