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
import { PurchaseService } from './purchase.service';

/* Entities */
import { Purchase } from './entities/purchase.entity';

/* DTO's */
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';

@Controller('purchase')
export class PurchaseController
  implements IBaseController<Purchase, CreatePurchaseDto, UpdatePurchaseDto>
{
  constructor(private readonly purchaseService: PurchaseService) {}

  @Get('count-all')
  countAll() {
    return this.purchaseService.countAll();
  }

  @Get('count')
  count() {
    return this.purchaseService.count();
  }

  @Get()
  findAll() {
    return this.purchaseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.purchaseService.findOne(+id);
  }

  @Get('supplier/:id')
  findOneByUserId(@Param('id', ParseIntPipe) id: number) {
    return this.purchaseService.findBySupplierId(id);
  }

  @Post()
  create(@Body() dto: CreatePurchaseDto) {
    return this.purchaseService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePurchaseDto: UpdatePurchaseDto,
  ) {
    return this.purchaseService.update(+id, updatePurchaseDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.purchaseService.remove(+id);
  }
}
