import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { StoreDetailService } from './store-detail.service';
import { UpdateStoreDetailDto } from './dto/update-store-detail.dto';

@Controller('store-detail')
export class StoreDetailController {
  constructor(private readonly storeDetailService: StoreDetailService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeDetailService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStoreDetailDto: UpdateStoreDetailDto,
  ) {
    return this.storeDetailService.update(+id, updateStoreDetailDto);
  }
}
