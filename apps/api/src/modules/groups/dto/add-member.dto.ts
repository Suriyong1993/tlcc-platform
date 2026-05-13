import { IsString, IsEnum } from 'class-validator';

export enum MemberRoleEnum {
  ADMIN = 'ADMIN',
  LEADER = 'LEADER',
  MEMBER = 'MEMBER',
}

export class AddMemberDto {
  @IsString()
  userId: string;

  @IsEnum(MemberRoleEnum)
  role?: MemberRoleEnum;
}
