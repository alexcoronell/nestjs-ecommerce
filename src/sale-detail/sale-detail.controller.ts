import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SaleDetailService } from './sale-detail.service';
import { CreateSaleDetailDto } from './dto/create-sale-detail.dto';

@Controller('sale-detail')
export class SaleDetailController {
  constructor(private readonly saleDetailService: SaleDetailService) {}

  @Post()
  create(@Body() dtos: CreateSaleDetailDto[]) {
    return this.saleDetailService.create(dtos);
  }

  @Get()
  findAll() {
    return this.saleDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saleDetailService.findOne(+id);
  }
}
