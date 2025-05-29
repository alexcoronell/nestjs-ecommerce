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
import { ProductService } from './product.service';

/* Entities */
import { Product } from './entities/product.entity';

/* DTO's */
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController
  implements IBaseController<Product, CreateProductDto, UpdateProductDto>
{
  constructor(private readonly productService: ProductService) {}

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

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(+id);
  }

  @Get('name/:name')
  findOneByname(@Param('name') name: string) {
    return this.productService.findOneByName(name);
  }

  @Post()
  create(@Body() payload: CreateProductDto) {
    return this.productService.create(payload);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateProductDto,
  ) {
    return this.productService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(+id);
  }
}
