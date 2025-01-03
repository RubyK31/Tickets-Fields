import { IsString, IsOptional, IsArray, IsNotEmpty } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  name: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  fieldIds: Array<number | { fieldName: string; type: string }>; // Allow both IDs and field objects
}

export class UpdateTicketDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  fieldIds: Array<number | { fieldName: string; type: string }>; // Can accept either field IDs or new field objects
}
