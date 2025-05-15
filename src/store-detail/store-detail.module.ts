import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreDetailService } from './store-detail.service';
import { StoreDetailController } from './store-detail.controller';
import { StoreDetail } from './entities/store-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreDetail])],
  controllers: [StoreDetailController],
  providers: [StoreDetailService],
})
export class StoreDetailModule {}
