import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum MessageTypeEnum {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
}

export class CreateMessageDto {
  @IsString()
  chatRoomId: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(MessageTypeEnum)
  type?: MessageTypeEnum;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
