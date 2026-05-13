import { IsString, IsOptional, IsDateString, IsInt, Min, IsArray } from 'class-validator';

export class CreateSermonDto {
  @IsString() title: string;
  @IsString() speakerName: string;
  @IsDateString() sermonDate: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() scripture?: string;
  @IsOptional() @IsString() series?: string;
  @IsOptional() @IsString() videoUrl?: string;
  @IsOptional() @IsString() audioUrl?: string;
  @IsOptional() @IsString() transcript?: string;
  @IsOptional() @IsString() thumbnailUrl?: string;
  @IsOptional() @IsInt() @Min(0) durationSec?: number;
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
}
