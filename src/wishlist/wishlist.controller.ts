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
import { WishlistService } from './wishlist.service';

/* DTO's */
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  findAll() {
    return this.wishlistService.findAll();
  }

  @Get('user/:userId/product/:productId')
  findOneByUserAndProduct(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.wishlistService.findOneByUserAndProduct(userId, productId);
  }

  @Get('customer/:userId')
  findAllByCustomer(@Param('userId', ParseIntPipe) userId: number) {
    return this.wishlistService.findAllByUser(userId);
  }

  @Get('product/:productId')
  findAllByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.wishlistService.findAllByProduct(productId);
  }

  @Get(':id')
  findOne(@Param('id') id: Wishlist['id']) {
    return this.wishlistService.findOne(+id);
  }

  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistService.create(createWishlistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: Wishlist['id']) {
    return this.wishlistService.remove(+id);
  }
}
