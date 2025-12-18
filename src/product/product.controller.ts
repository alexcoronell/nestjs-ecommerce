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
} from '@nestjs/common';

/* Interface */
import { IBaseController } from '@commons/interfaces/i-base-controller';

/* Decorators */
import { UserId } from '@auth/decorators/user-id.decorator';

/* Services */
import { ProductService } from './product.service';

/* Entities */
import { Product } from './entities/product.entity';

/* DTO's */
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

/* Guards */
import { JwtAuthGuard } from '@auth/guards/jwt-auth/jwt-auth.guard';
import { IsNotCustomerGuard } from '@auth/guards/is-not-customer/is-not-customer.guard';
import { AdminGuard } from '@auth/guards/admin-auth/admin-auth.guard';

@Controller('product')
export class ProductController
  implements IBaseController<Product, CreateProductDto, UpdateProductDto>
{
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('count-all')
  countAll() {
    return this.productService.countAll();
  }

  @Get('count')
  count() {
    return this.productService.count();
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @UseGuards(JwtAuthGuard, IsNotCustomerGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(+id);
  }

  @Get('name/:name')
  findOneByname(@Param('name') name: string) {
    return this.productService.findOneByName(name);
  }

  @Get('brand/:brandId')
  findByBrand(@Param('brandId', ParseIntPipe) brandId: number) {
    return this.productService.findByBrand(+brandId);
  }

  @Get('category/:categoryId')
  findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.productService.findByCategory(+categoryId);
  }

  @Get('subcategory/:subcategoryId')
  findBySubcategory(
    @Param('subcategoryId', ParseIntPipe) subcategoryId: number,
  ) {
    return this.productService.findBySubcategory(+subcategoryId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  create(@Body() payload: CreateProductDto, @UserId() userId: number) {
    return this.productService.create(payload, userId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @UserId() userId: number,
    @Body() updateCategoryDto: UpdateProductDto,
  ) {
    return this.productService.update(+id, userId, updateCategoryDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @UserId() userId: number) {
    return this.productService.remove(+id, userId);
  }
}
