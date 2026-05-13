import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';

export enum ArticleStatusEnum { DRAFT = 'DRAFT', PUBLISHED = 'PUBLISHED', ARCHIVED = 'ARCHIVED' }

export class CreateArticleDto {
  @IsString() title: string;
  @IsString() slug: string;
  @IsString() content: string;
  @IsOptional() @IsString() excerpt?: string;
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsEnum(ArticleStatusEnum) status?: ArticleStatusEnum;
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
}
