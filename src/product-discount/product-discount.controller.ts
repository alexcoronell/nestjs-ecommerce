import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ProductDiscountService } from './product-discount.service';
import { CreateProductDiscountDto } from './dto/create-product-discount.dto';

@Controller('product-discount')
export class ProductDiscountController {
  constructor(
    private readonly productDiscountService: ProductDiscountService,
  ) {}

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productDiscountService.remove(+id);
  }
}
