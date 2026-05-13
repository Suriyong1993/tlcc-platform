import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  userId: string;

  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;
}
