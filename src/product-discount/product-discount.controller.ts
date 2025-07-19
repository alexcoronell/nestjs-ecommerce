import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ProductDiscountService } from './product-discount.service';
import { CreateProductDiscountDto } from './dto/create-product-discount.dto';

@Controller('product-discount')
export class ProductDiscountController {
  constructor(
    private readonly productDiscountService: ProductDiscountService,
  ) {}

  @Get('count')
  countAll() {
    return this.productDiscountService.countAll();
  }

  @Get()
  findAll() {
    return this.productDiscountService.findAll();
  }

  @Get('product/:id')
  findAllByProduct(@Param('id') id: number) {
    return this.productDiscountService.findAllByProduct(+id);
  }

  @Get('discount/:id')
  findAllByDiscount(@Param('id') id: number) {
    return this.productDiscountService.findAllByDiscount(+id);
  }

  @Get('one')
  findOne(
    @Body() criteria: Partial<{ productId: number; discountId: number }>,
  ) {
    return this.productDiscountService.findOne(criteria);
  }

  @Post()
  create(@Body() createProductDiscountDto: CreateProductDiscountDto) {
    return this.productDiscountService.create(createProductDiscountDto);
  }

  @Post('many')
  createMany(
    @Body() dtos: CreateProductDiscountDto | CreateProductDiscountDto[],
  ) {
    return this.productDiscountService.createMany(dtos);
  }

  @Delete()
  delete(@Body() criteria: Partial<{ productId: number; discountId: number }>) {
    return this.productDiscountService.delete(criteria);
  }
}
