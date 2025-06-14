import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductImagesService } from '@product_images/product-images.service';
import { CreateProductImageDto } from '@product_images/dto/create-product-image.dto';
import { UpdateProductImageDto } from '@product_images/dto/update-product-image.dto';

@Controller('product-images')
export class ProductImagesController {
  constructor(private readonly productImagesService: ProductImagesService) {}

  @Post()
  create(@Body() createProductImageDto: CreateProductImageDto) {
    return this.productImagesService.create(createProductImageDto);
  }

  @Get()
  findAll() {
    return this.productImagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productImagesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductImageDto: UpdateProductImageDto,
  ) {
    return this.productImagesService.update(+id, updateProductImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productImagesService.remove(+id);
  }
}
