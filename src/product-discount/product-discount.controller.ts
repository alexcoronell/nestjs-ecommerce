import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
} from '@nestjs/common';

/* Interface */
import { AuthRequest } from '@auth/interfaces/auth-request.interface';

/* Services */
import { ProductDiscountService } from './product-discount.service';

/* DTO's */
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
  create(
    @Body() createProductDiscountDto: CreateProductDiscountDto,
    @Req() req: AuthRequest,
  ) {
    const userId = req.user;
    return this.productDiscountService.create(createProductDiscountDto, userId);
  }

  @Post('many')
  createMany(
    @Body() dtos: CreateProductDiscountDto | CreateProductDiscountDto[],
    @Req() req: AuthRequest,
  ) {
    const userId = req.user;
    return this.productDiscountService.createMany(dtos, userId);
  }

  @Delete()
  delete(@Body() criteria: Partial<{ productId: number; discountId: number }>) {
    return this.productDiscountService.delete(criteria);
  }
}
