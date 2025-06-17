import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ProductTagService } from './product-tag.service';
import { CreateProductTagDto } from './dto/create-product-tag.dto';

@Controller('product-tag')
export class ProductTagController {
  constructor(private readonly productTagService: ProductTagService) {}

  @Post()
  create(@Body() createProductTagDto: CreateProductTagDto) {
    return this.productTagService.create(createProductTagDto);
  }

  @Get()
  findAll() {
    return this.productTagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productTagService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productTagService.remove(+id);
  }
}
