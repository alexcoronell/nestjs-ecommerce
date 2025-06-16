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
import { DiscountService } from '@discount/discount.service';

/* Entities */
import { Discount } from '@discount/entities/discount.entity';

/* DTO's */
import { CreateDiscountDto } from '@discount/dto/create-discount.dto';
import { UpdateDiscountDto } from '@discount/dto/update-discount.dto';

@Controller('discount')
export class DiscountController
  implements IBaseController<Discount, CreateDiscountDto, UpdateDiscountDto>
{
  constructor(private readonly discountService: DiscountService) {}

  @Get('count-all')
  countAll() {
    return this.discountService.countAll();
  }

  @Get('count')
  count() {
    return this.discountService.count();
  }

  @Get()
  findAll() {
    return this.discountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.discountService.findOne(+id);
  }

  @Get('code/:code')
  findOneByCode(@Param('code') code: string) {
    return this.discountService.findOneByCode(code);
  }

  @Post()
  create(@Body() payload: CreateDiscountDto) {
    return this.discountService.create(payload);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateDiscountDto,
  ) {
    return this.discountService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.discountService.remove(+id);
  }
}
