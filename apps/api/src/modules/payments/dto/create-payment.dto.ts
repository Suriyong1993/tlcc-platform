import { IsString, IsOptional, IsEnum, IsNumber, Min } from 'class-validator';

export enum PaymentTypeEnum {
  TITHE = 'TITHE',
  DONATION = 'DONATION',
  EVENT_FEE = 'EVENT_FEE',
  OTHER = 'OTHER',
}

export enum PaymentStatusEnum {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
}

export class CreatePaymentDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsEnum(PaymentTypeEnum)
  type: PaymentTypeEnum;

  @IsString()
  paymentMethod: string;

  @IsOptional()
  @IsString()
  reference?: string;
}
