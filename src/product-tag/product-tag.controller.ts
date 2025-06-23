import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

/* Services */
import { ProductTagService } from './product-tag.service';

/* DTO's */
import { CreateProductTagDto } from './dto/create-product-tag.dto';

@Controller('product-tag')
export class ProductTagController {
  constructor(private readonly productTagService: ProductTagService) {}

  @Get('count-all')
  countAll() {
    return this.productTagService.countAll();
  }

  @Get()
  findAll() {
    return this.productTagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productTagService.findOne(+id);
  }

  @Get('by-product/:id')
  findAllByProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productTagService.findAllByProduct(+id);
  }

  @Get('by-tag/:id')
  findAllByTag(@Param('id', ParseIntPipe) id: number) {
    return this.productTagService.findAllByTag(+id);
  }

  @Post()
  create(@Body() payload: CreateProductTagDto) {
    return this.productTagService.create(payload);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productTagService.remove(+id);
  }
}
