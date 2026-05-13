import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class RegisterEventDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  guestCount?: number;

  @IsOptional()
  @IsString()
  note?: string;
}
