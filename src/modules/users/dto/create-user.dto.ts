import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsAlphanumeric,
  IsArray,
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { UserStatus } from '../enums/user-status.enum';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: "user's email", nullable: false })
  readonly email: string;

  // @Matches(passwordRegex, { message: 'Password muy sencillo' })
  @IsAlphanumeric()
  @IsNotEmpty()
  @Length(6, 20)
  @ApiProperty()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(50)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty()
  readonly firstLastname: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  @ApiProperty()
  readonly secondLastname: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly phone: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @ApiProperty()
  readonly birthdate: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly status: UserStatus;

  @ApiProperty({ example: [1, 2] })
  @ArrayNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  rolesIds: number[];
}
