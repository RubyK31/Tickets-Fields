import { IsOptional, IsString } from 'class-validator';

export class CreateFieldDto {
  @IsString()
  fieldName: string;

  @IsString()
  type: string;
}

export class UpdateFieldDto {
  @IsOptional()
  @IsString()
  fieldName?: string;

  @IsOptional()
  @IsString()
  type?: string;
}
