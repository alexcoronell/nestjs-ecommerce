import { PartialType } from '@nestjs/swagger';
import { OmitType } from '@nestjs/swagger';
import { CreateBrandDto } from './create-brand.dto';

export class UpdateBrandDto extends PartialType(
  OmitType(CreateBrandDto, ['createdBy']),
) {}
