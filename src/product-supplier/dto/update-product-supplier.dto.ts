import { PartialType } from '@nestjs/swagger';
import { OmitType } from '@nestjs/swagger';
import { CreateProductSupplierDto } from './create-product-supplier.dto';

export class UpdateProductSupplierDto extends PartialType(
  OmitType(CreateProductSupplierDto, ['createdBy']),
) {}
