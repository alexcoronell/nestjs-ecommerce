import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistService.create(createWishlistDto);
  }

  @Get()
  findAll() {
    return this.wishlistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishlistService.remove(+id);
  }
}
