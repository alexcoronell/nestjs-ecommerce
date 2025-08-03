import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

/* Interface */
import { IBaseController } from '@commons/interfaces/i-base-controller';

/* Services */
import { PurchaseDetailService } from './purchase-detail.service';

/* Entities */
import { PurchaseDetail } from './entities/purchase-detail.entity';

/* DTO's */
import { CreatePurchaseDetailDto } from './dto/create-purchase-detail.dto';
import { UpdatePurchaseDetailDto } from './dto/update-purchase-detail.dto';

@Controller('purchase-detail')
export class PurchaseDetailController
  implements
    IBaseController<
      PurchaseDetail,
      CreatePurchaseDetailDto,
      UpdatePurchaseDetailDto
    >
{
  constructor(private readonly purchaseDetailService: PurchaseDetailService) {}

  @Get('count-all')
  countAll() {
    return this.purchaseDetailService.countAll();
  }

  @Get('count')
  count() {
    return this.purchaseDetailService.count();
  }

  @Get()
  findAll() {
    return this.purchaseDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.purchaseDetailService.findOne(+id);
  }

  @Get('purchase/:id')
  findByPurchaseId(@Param('id', ParseIntPipe) id: number) {
    return this.purchaseDetailService.findByPurchaseId(+id);
  }

  @Post()
  create(@Body() payload: CreatePurchaseDetailDto[]) {
    return this.purchaseDetailService.create(payload);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdatePurchaseDetailDto,
  ) {
    return this.purchaseDetailService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.purchaseDetailService.remove(+id);
  }
}
