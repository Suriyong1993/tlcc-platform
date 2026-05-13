import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateReportDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
