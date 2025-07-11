import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductDiscountService } from './product-discount.service';
import { CreateProductDiscountDto } from './dto/create-product-discount.dto';
import { UpdateProductDiscountDto } from './dto/update-product-discount.dto';

@Controller('product-discount')
export class ProductDiscountController {
  constructor(private readonly productDiscountService: ProductDiscountService) {}

  @Post()
  create(@Body() createProductDiscountDto: CreateProductDiscountDto) {
    return this.productDiscountService.create(createProductDiscountDto);
  }

  @Get()
  findAll() {
    return this.productDiscountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productDiscountService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDiscountDto: UpdateProductDiscountDto) {
    return this.productDiscountService.update(+id, updateProductDiscountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productDiscountService.remove(+id);
  }
}
