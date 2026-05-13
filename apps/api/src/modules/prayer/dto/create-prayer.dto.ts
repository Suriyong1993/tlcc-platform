import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreatePrayerDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
