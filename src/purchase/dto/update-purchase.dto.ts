import { PartialType } from '@nestjs/swagger';
import { OmitType } from '@nestjs/swagger';
import { CreatePurchaseDto } from './create-purchase.dto';

export class UpdatePurchaseDto extends PartialType(
  OmitType(CreatePurchaseDto, ['createdBy']),
) {}
