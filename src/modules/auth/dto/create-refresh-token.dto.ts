import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateRefreshTokenDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  ip: string;

  @IsNotEmpty()
  @IsString()
  userAgent: string;

  @IsString()
  browser?: string;

  @IsString()
  os?: string;
}