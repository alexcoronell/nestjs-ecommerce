import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';

/* Services */
import { ProductTagService } from './product-tag.service';

/* Decorators */
import { UserId } from '@auth/decorators/user-id.decorator';

/* DTO's */
import { CreateProductTagDto } from './dto/create-product-tag.dto';

@Controller('product-tag')
export class ProductTagController {
  constructor(private readonly productTagService: ProductTagService) {}

  @Get('count')
  countAll() {
    return this.productTagService.countAll();
  }

  @Get()
  findAll() {
    return this.productTagService.findAll();
  }

  @Get('product/:id')
  findAllByProduct(@Param('id') id: number) {
    return this.productTagService.findAllByProduct(+id);
  }

  @Get('tag/:id')
  findAllByTag(@Param('id') id: number) {
    return this.productTagService.findAllByTag(+id);
  }

  @Get('one')
  findOne(@Body() criteria: Partial<{ productId: number; tagId: number }>) {
    return this.productTagService.findOne(criteria);
  }

  @Post()
  create(
    @Body() createProductTagDto: CreateProductTagDto,
    @UserId() userId: number,
  ) {
    return this.productTagService.create(createProductTagDto, userId);
  }

  @Post('many')
  createMany(
    @Body() dtos: CreateProductTagDto | CreateProductTagDto[],
    @UserId() userId: number,
  ) {
    return this.productTagService.createMany(dtos, userId);
  }

  @Delete()
  delete(@Body() criteria: Partial<{ productId: number; tagId: number }>) {
    return this.productTagService.delete(criteria);
  }
}
