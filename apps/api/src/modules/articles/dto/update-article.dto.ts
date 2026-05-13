import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ArticleStatusEnum } from './create-article.dto';

export class UpdateArticleDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsString() excerpt?: string;
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsEnum(ArticleStatusEnum) status?: ArticleStatusEnum;
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
}
