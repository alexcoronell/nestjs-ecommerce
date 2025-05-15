import { Module } from '@nestjs/common';
import { StoreDetailService } from './store-detail.service';
import { StoreDetailController } from './store-detail.controller';

@Module({
  controllers: [StoreDetailController],
  providers: [StoreDetailService],
})
export class StoreDetailModule {}
