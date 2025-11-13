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

/* Interfaces */
import { AuthRequest } from '@auth/interfaces/auth-request.interface';
import { IBaseController } from '@commons/interfaces/i-base-controller';

/* Services */
import { ProductSupplierService } from './product-supplier.service';

/* Entities */
import { ProductSupplier } from './entities/product-supplier.entity';

/* DTO's */
import { CreateProductSupplierDto } from './dto/create-product-supplier.dto';
import { UpdateProductSupplierDto } from './dto/update-product-supplier.dto';

@Controller('product-supplier')
export class ProductSupplierController
  implements
    IBaseController<
      ProductSupplier,
      CreateProductSupplierDto,
      UpdateProductSupplierDto
    >
{
  constructor(
    private readonly productSupplierService: ProductSupplierService,
  ) {}

  @Get('count-all')
  countAll() {
    return this.productSupplierService.countAll();
  }

  @Get('count')
  count() {
    return this.productSupplierService.count();
  }

  @Get()
  findAll() {
    return this.productSupplierService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productSupplierService.findOne(+id);
  }

  @Get('by-product/:id')
  findAllByProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productSupplierService.findAllByProduct(+id);
  }

  @Get('by-supplier/:id')
  findAllBySupplier(@Param('id', ParseIntPipe) id: number) {
    return this.productSupplierService.findAllBySupplier(+id);
  }

  @Post()
  create(@Body() payload: CreateProductSupplierDto, @Req() req: AuthRequest) {
    const userId = req.user;
    return this.productSupplierService.create(payload, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthRequest,
    @Body() updateCategoryDto: UpdateProductSupplierDto,
  ) {
    const userId = req.user;
    return this.productSupplierService.update(+id, userId, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: AuthRequest) {
    const userId = req.user;
    return this.productSupplierService.remove(+id, userId);
  }
}
