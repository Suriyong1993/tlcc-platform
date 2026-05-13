import { IsString } from 'class-validator';

export class CreateArticleCommentDto {
  @IsString() content: string;
}
