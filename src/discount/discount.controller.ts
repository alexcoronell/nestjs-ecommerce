import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';

/* Interface */
import { AuthRequest } from '@auth/interfaces/auth-request.interface';
import { IBaseController } from '@commons/interfaces/i-base-controller';

/* Services */
import { DiscountService } from '@discount/discount.service';

/* Entities */
import { Discount } from '@discount/entities/discount.entity';

/* DTO's */
import { CreateDiscountDto } from '@discount/dto/create-discount.dto';
import { UpdateDiscountDto } from '@discount/dto/update-discount.dto';

/* Guards */
import { AdminGuard } from '@auth/guards/admin-auth/admin-auth.guard';
import { IsNotCustomerGuard } from '@auth/guards/is-not-customer/is-not-customer.guard';
import { JwtAuthGuard } from '@auth/guards/jwt-auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard, IsNotCustomerGuard)
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

  @UseGuards(AdminGuard)
  @Post()
  create(@Body() payload: CreateDiscountDto, @Req() req: AuthRequest) {
    const userId = req.user;
    return this.discountService.create(payload, userId);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthRequest,
    @Body() updateCategoryDto: UpdateDiscountDto,
  ) {
    const userId = req.user;
    return this.discountService.update(+id, userId, updateCategoryDto);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: AuthRequest) {
    const userId = req.user;
    return this.discountService.remove(+id, userId);
  }
}
