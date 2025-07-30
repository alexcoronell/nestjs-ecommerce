import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

/* Modules */
import { DatabaseModule } from './database/database.module';
import { AuthModule } from '@auth/auth.module';
import { BrandModule } from '@brand/brand.module';
import { CategoryModule } from '@category/category.module';
import { PaymentMethodModule } from '@payment_method/payment-method.module';
import { SupplierModule } from '@supplier/supplier.module';
import { UserModule } from '@user/user.module';
import { ShippingCompanyModule } from './shipping-company/shipping-company.module';
import { TagModule } from './tag/tag.module';
import { StoreDetailModule } from './store-detail/store-detail.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { ProductModule } from './product/product.module';
import { ProductImagesModule } from './product-images/product-images.module';
import { DiscountModule } from './discount/discount.module';
import { ProductTagModule } from './product-tag/product-tag.module';
import { ProductSupplierModule } from './product-supplier/product-supplier.module';
import { ProductDiscountModule } from './product-discount/product-discount.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { SaleModule } from './sale/sale.module';

/* Config */
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [config],
      isGlobal: true,
    }),
    UserModule,
    DatabaseModule,
    AuthModule,
    CategoryModule,
    BrandModule,
    SupplierModule,
    PaymentMethodModule,
    ShippingCompanyModule,
    TagModule,
    StoreDetailModule,
    SubcategoryModule,
    ProductModule,
    ProductImagesModule,
    DiscountModule,
    ProductTagModule,
    ProductSupplierModule,
    ProductDiscountModule,
    WishlistModule,
    SaleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
