import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

/* Services */
import { SaleDetailService } from './sale-detail.service';

/* DTO's */
import { CreateSaleDetailDto } from './dto/create-sale-detail.dto';

@Controller('sale-detail')
export class SaleDetailController {
  constructor(private readonly saleDetailService: SaleDetailService) {}

  @Get('count')
  count() {
    return this.saleDetailService.count();
  }

  @Get()
  findAll() {
    return this.saleDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.saleDetailService.findOne(id);
  }

  @Get('sale/:id')
  findBySaleId(@Param('id', ParseIntPipe) id: number) {
    return this.saleDetailService.findBySaleId(id);
  }

  @Post()
  create(@Body() payload: CreateSaleDetailDto[]) {
    return this.saleDetailService.create(payload);
  }
}
