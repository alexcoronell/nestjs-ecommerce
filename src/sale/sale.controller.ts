import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
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
    return this.saleService.findAllByUserId(userId);
  }

  @Get('payment-method/:paymentMethod')
  findAllByPaymentMethod(@Param('paymentMethodId') paymentMethodId: number) {
    return this.saleService.findAllByPaymentMethodId(paymentMethodId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.saleService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateSaleDto) {
    return this.saleService.create(dto);
  }

  @Delete(':id')
  cancel(@Param('id') id: number) {
    return this.saleService.cancel(+id);
  }
}
