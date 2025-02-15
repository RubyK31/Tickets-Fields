import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @IsNotEmpty()
  role_name?: string;

  @IsString()
  @IsOptional()
  role_description?: string;
}
