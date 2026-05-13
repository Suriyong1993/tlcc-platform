import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';

export enum ChatTypeEnum {
  DIRECT = 'DIRECT',
  GROUP = 'GROUP',
  BROADCAST = 'BROADCAST',
}

export class CreateChatRoomDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsEnum(ChatTypeEnum)
  type: ChatTypeEnum;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsArray()
  @IsString({ each: true })
  memberIds: string[];
}
