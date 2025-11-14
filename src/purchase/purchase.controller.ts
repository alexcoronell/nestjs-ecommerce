import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
} from '@nestjs/common';

/* Interface */
import { AuthRequest } from '@auth/interfaces/auth-request.interface';
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
  findOneBySupplierId(@Param('id', ParseIntPipe) id: number) {
    return this.purchaseService.findBySupplierId(id);
  }

  @Post()
  create(@Body() dto: CreatePurchaseDto, @Req() req: AuthRequest) {
    const userId = req.user;
    return this.purchaseService.create(dto, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthRequest,
    @Body() updatePurchaseDto: UpdatePurchaseDto,
  ) {
    const userId = req.user;
    return this.purchaseService.update(+id, userId, updatePurchaseDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: AuthRequest) {
    const userId = req.user;
    return this.purchaseService.remove(+id, userId);
  }
}
