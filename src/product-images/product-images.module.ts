import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImagesService } from '@product_images/product-images.service';
import { ProductImagesController } from '@product_images/product-images.controller';
import { ProductImage } from '@product_images/entities/product-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductImage])],
  controllers: [ProductImagesController],
  providers: [ProductImagesService],
})
export class ProductImagesModule {}
