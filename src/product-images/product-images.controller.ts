import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Req,
  Patch,
} from '@nestjs/common';

/* Interface */
import { AuthRequest } from '@auth/interfaces/auth-request.interface';
import { IBaseController } from '@commons/interfaces/i-base-controller';

/* Services */
import { ProductImagesService } from '@product_images/product-images.service';

/* Entities */
import { ProductImage } from './entities/product-image.entity';

/* DTO's */
import { CreateProductImageDto } from '@product_images/dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';

@Controller('product-images')
export class ProductImagesController
  implements
    IBaseController<ProductImage, CreateProductImageDto, UpdateProductImageDto>
{
  constructor(private readonly productImagesService: ProductImagesService) {}

  @Get('count-all')
  countAll() {
    return this.productImagesService.countAll();
  }

  @Get('count')
  count() {
    return this.productImagesService.count();
  }

  @Get()
  findAll() {
    return this.productImagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productImagesService.findOne(+id);
  }

  @Post()
  create(@Body() payload: CreateProductImageDto, @Req() req: AuthRequest) {
    const userId = req.user;
    return this.productImagesService.create(payload, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthRequest,
    @Body() updateProductImageDto: UpdateProductImageDto,
  ) {
    const userId = req.user;
    return this.productImagesService.update(+id, userId, updateProductImageDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productImagesService.remove(+id);
  }
}
