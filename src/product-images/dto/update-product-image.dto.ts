/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { PartialType } from '@nestjs/swagger';
import { OmitType } from '@nestjs/swagger';
import { CreateProductImageDto } from '@product_images/dto/create-product-image.dto';

export class UpdateProductImageDto extends PartialType(
  OmitType(CreateProductImageDto, ['uploadedBy']),
) {}
