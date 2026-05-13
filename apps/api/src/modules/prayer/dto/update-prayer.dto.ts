import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdatePrayerDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  isAnswered?: boolean;
}
