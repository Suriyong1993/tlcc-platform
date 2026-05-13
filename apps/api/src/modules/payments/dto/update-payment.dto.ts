import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { PaymentStatusEnum } from './create-payment.dto';

export class UpdatePaymentDto {
  @IsOptional()
  @IsEnum(PaymentStatusEnum)
  status?: PaymentStatusEnum;

  @IsOptional()
  @IsDateString()
  paidAt?: string;

  @IsOptional()
  @IsString()
  reference?: string;
}
