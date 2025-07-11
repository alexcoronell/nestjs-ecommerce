import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDiscountService } from './product-discount.service';
import { ProductDiscountController } from './product-discount.controller';
import { ProductDiscount } from './entities/product-discount.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductDiscount])],
  controllers: [ProductDiscountController],
  providers: [ProductDiscountService],
})
export class ProductDiscountModule {}
