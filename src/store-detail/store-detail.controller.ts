import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StoreDetailService } from './store-detail.service';
import { CreateStoreDetailDto } from './dto/create-store-detail.dto';
import { UpdateStoreDetailDto } from './dto/update-store-detail.dto';

@Controller('store-detail')
export class StoreDetailController {
  constructor(private readonly storeDetailService: StoreDetailService) {}

  @Post()
  create(@Body() createStoreDetailDto: CreateStoreDetailDto) {
    return this.storeDetailService.create(createStoreDetailDto);
  }

  @Get()
  findAll() {
    return this.storeDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeDetailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreDetailDto: UpdateStoreDetailDto) {
    return this.storeDetailService.update(+id, updateStoreDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeDetailService.remove(+id);
  }
}
