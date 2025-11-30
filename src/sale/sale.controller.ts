import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';

/* Decorators */
import { UserId } from '@auth/decorators/user-id.decorator';

import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Get('count-all')
  countAll() {
    return this.saleService.countAll();
  }

  @Get('count')
  count() {
    return this.saleService.count();
  }

  @Get()
  findAll() {
    return this.saleService.findAll();
  }

  @Get('user/:userId')
  findAllByUser(@Param('userId') userId: number) {
    return this.saleService.findAllByUser(userId);
  }

  @Get('payment-method/:paymentMethod')
  findAllByPaymentMethod(@Param('paymentMethodId') paymentMethodId: number) {
    return this.saleService.findAllByPaymentMethod(paymentMethodId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.saleService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateSaleDto, @UserId() userId: number) {
    return this.saleService.create(dto, userId);
  }

  @Delete(':id')
  cancel(@Param('id') id: number, @UserId() userId: number) {
    return this.saleService.cancel(+id, userId);
  }
}
