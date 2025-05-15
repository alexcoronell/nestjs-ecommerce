/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { PartialType } from '@nestjs/swagger';
import { OmitType } from '@nestjs/swagger';
import { CreatePaymentMethodDto } from './create-payment-method.dto';

export class UpdatePaymentMethodDto extends PartialType(
  OmitType(CreatePaymentMethodDto, ['createdBy']),
) {}
