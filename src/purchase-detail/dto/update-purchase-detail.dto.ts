import { OmitType, PartialType } from '@nestjs/swagger';
import { CreatePurchaseDetailDto } from './create-purchase-detail.dto';

export class UpdatePurchaseDetailDto extends PartialType(
  OmitType(CreatePurchaseDetailDto, ['createdBy']),
) {}
