/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { PartialType } from '@nestjs/swagger';
import { OmitType } from '@nestjs/swagger';
import { CreateBrandDto } from '@brand/dto/create-brand.dto';

export class UpdateBrandDto extends PartialType(
  OmitType(CreateBrandDto, ['createdBy']),
) {}
