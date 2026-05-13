import { IsOptional, IsString, IsEnum, MaxLength } from 'class-validator';

export enum Gender { MALE = 'MALE', FEMALE = 'FEMALE', OTHER = 'OTHER' }

export class UpdateProfileDto {
  @IsOptional() @IsString() @MaxLength(50)
  firstName?: string;

  @IsOptional() @IsString() @MaxLength(50)
  lastName?: string;

  @IsOptional() @IsString() @MaxLength(500)
  bio?: string;

  @IsOptional() @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  birthDate?: Date;
}
