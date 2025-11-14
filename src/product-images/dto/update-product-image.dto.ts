import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateProductImageDto } from '@product_images/dto/create-product-image.dto';

export class UpdateProductImageDto extends PartialType(
  OmitType(CreateProductImageDto, ['filePath', 'product']),
) {}
