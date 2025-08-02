import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseDetailService } from './purchase-detail.service';
import { PurchaseDetailController } from './purchase-detail.controller';
import { PurchaseDetail } from './entities/purchase-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseDetail])],
  controllers: [PurchaseDetailController],
  providers: [PurchaseDetailService],
})
export class PurchaseDetailModule {}
