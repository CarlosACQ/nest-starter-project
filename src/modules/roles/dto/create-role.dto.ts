import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly description: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  readonly isActive: boolean;

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  readonly permissionsIds: number[];
}
